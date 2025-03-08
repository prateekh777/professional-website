import { ObjectId } from 'mongodb';
import { getCollection } from './mongodb';
import * as schemas from './schemas';
import { validateEnv } from './env';
import { getMediaUrl, formatMediaUrls, formatItemUrls } from './s3-url';

/**
 * MongoDB Storage Class
 * 
 * Implements CRUD operations for all schema types
 */
export class MongoDBStorage {
  private readonly collectionName = 'portfolio';

  constructor() {
    // Validate environment variables
    try {
      validateEnv();
    } catch (error) {
      console.error('Environment validation failed:', error);
      throw error;
    }
  }

  /**
   * Convert MongoDB _id to string id
   */
  private convertIdToString<T extends { _id: ObjectId }>(doc: T): Omit<T, '_id'> & { id: string } {
    const { _id, ...rest } = doc;
    return {
      ...rest,
      id: _id.toString(),
    } as Omit<T, '_id'> & { id: string };
  }

  /**
   * Convert string id to MongoDB _id
   */
  private convertStringToId<T extends { id: string }>(doc: T): Omit<T, 'id'> & { _id: ObjectId } {
    const { id, ...rest } = doc;
    return {
      ...rest,
      _id: new ObjectId(id),
    } as Omit<T, 'id'> & { _id: ObjectId };
  }

  /**
   * Log operation with timing
   */
  private async logOperation<T>(operation: string, fn: () => Promise<T>): Promise<T> {
    const startTime = Date.now();
    try {
      const result = await fn();
      const duration = Date.now() - startTime;
      console.log(`[MongoDB] ${operation} completed in ${duration}ms`);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`[MongoDB] ${operation} failed after ${duration}ms:`, error);
      throw error;
    }
  }

  // ==================== Section Operations ====================

  /**
   * Get sections by type
   */
  async getSections(type?: string): Promise<schemas.Section[]> {
    return this.logOperation(`Get sections${type ? ` (type: ${type})` : ''}`, async () => {
      const collection = await getCollection<any>(this.collectionName);
      
      const query = {
        _type: 'section',
        ...(type ? { type } : {}),
      };
      
      const documents = await collection.find(query).sort({ order: 1 }).toArray();
      
      return documents.map(doc => this.convertIdToString(doc)) as schemas.Section[];
    });
  }

  /**
   * Get section by ID
   */
  async getSection(id: string): Promise<schemas.Section | null> {
    return this.logOperation(`Get section (id: ${id})`, async () => {
      const collection = await getCollection<any>(this.collectionName);
      
      const document = await collection.findOne({
        _id: new ObjectId(id),
        _type: 'section',
      });
      
      if (!document) {
        return null;
      }
      
      // Format media URLs if present
      if (document.media) {
        document.media = formatMediaUrls(document.media);
      }
      
      return this.convertIdToString(document) as schemas.Section;
    });
  }

  /**
   * Create a new section
   */
  async createSection(section: schemas.InsertSection): Promise<schemas.Section> {
    return this.logOperation('Create section', async () => {
      // Validate the section data
      const validatedSection = schemas.insertSectionSchema.parse(section);
      
      const collection = await getCollection<any>(this.collectionName);
      
      const now = new Date();
      const document = {
        ...validatedSection,
        _type: 'section',
        createdAt: now,
        updatedAt: now,
      };
      
      const result = await collection.insertOne(document);
      
      if (!result.acknowledged) {
        throw new Error('Failed to create section');
      }
      
      return {
        ...validatedSection,
        id: result.insertedId.toString(),
        createdAt: now,
        updatedAt: now,
      } as schemas.Section;
    });
  }

  /**
   * Update a section
   */
  async updateSection(id: string, section: Partial<schemas.InsertSection>): Promise<schemas.Section | null> {
    return this.logOperation(`Update section (id: ${id})`, async () => {
      // Validate the section data
      const validatedSection = schemas.updateSectionSchema.parse(section);
      
      const collection = await getCollection<any>(this.collectionName);
      
      const now = new Date();
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id), _type: 'section' },
        { 
          $set: {
            ...validatedSection,
            updatedAt: now,
          }
        },
        { returnDocument: 'after' }
      );
      
      if (!result) {
        return null;
      }
      
      // Format media URLs if present
      if (result.value.media) {
        result.value.media = formatMediaUrls(result.value.media);
      }
      
      return this.convertIdToString(result.value) as schemas.Section;
    });
  }

  /**
   * Delete a section
   */
  async deleteSection(id: string): Promise<boolean> {
    return this.logOperation(`Delete section (id: ${id})`, async () => {
      const collection = await getCollection<any>(this.collectionName);
      
      const result = await collection.deleteOne({
        _id: new ObjectId(id),
        _type: 'section',
      });
      
      return result.deletedCount === 1;
    });
  }

  // ==================== Project Operations ====================

  /**
   * Get all projects
   */
  async getProjects(featured?: boolean): Promise<schemas.Project[]> {
    return this.logOperation(`Get projects${featured ? ' (featured)' : ''}`, async () => {
      const collection = await getCollection<any>(this.collectionName);
      
      const query = {
        _type: 'project',
        ...(featured !== undefined ? { featured } : {}),
      };
      
      const documents = await collection.find(query).sort({ order: 1 }).toArray();
      
      return documents.map(doc => this.convertIdToString(doc)) as schemas.Project[];
    });
  }

  /**
   * Get project by ID
   */
  async getProject(id: string): Promise<schemas.Project | null> {
    return this.logOperation(`Get project (id: ${id})`, async () => {
      const collection = await getCollection<any>(this.collectionName);
      
      const document = await collection.findOne({
        _id: new ObjectId(id),
        _type: 'project',
      });
      
      if (!document) {
        return null;
      }
      
      // Format all URL fields
      const formattedProject = formatItemUrls(document, ['imageUrl', 'thumbnailUrl', 'videoUrl']);
      
      return this.convertIdToString(formattedProject) as schemas.Project;
    });
  }

  /**
   * Get project by slug
   */
  async getProjectBySlug(slug: string): Promise<schemas.Project | null> {
    return this.logOperation(`Get project by slug (slug: ${slug})`, async () => {
      const collection = await getCollection<any>(this.collectionName);
      
      const document = await collection.findOne({
        slug,
        _type: 'project',
      });
      
      if (!document) {
        return null;
      }
      
      // Format all URL fields
      const formattedProject = formatItemUrls(document, ['imageUrl', 'thumbnailUrl', 'videoUrl']);
      
      return this.convertIdToString(formattedProject) as schemas.Project;
    });
  }

  /**
   * Create a new project
   */
  async createProject(project: schemas.InsertProject): Promise<schemas.Project> {
    return this.logOperation('Create project', async () => {
      // Validate the project data
      const validatedProject = schemas.insertProjectSchema.parse(project);
      
      const collection = await getCollection<any>(this.collectionName);
      
      const now = new Date();
      const document = {
        ...validatedProject,
        _type: 'project',
        createdAt: now,
        updatedAt: now,
      };
      
      const result = await collection.insertOne(document);
      
      if (!result.acknowledged) {
        throw new Error('Failed to create project');
      }
      
      return {
        ...validatedProject,
        id: result.insertedId.toString(),
        createdAt: now,
        updatedAt: now,
      } as schemas.Project;
    });
  }

  /**
   * Update a project
   */
  async updateProject(id: string, project: Partial<schemas.InsertProject>): Promise<schemas.Project | null> {
    return this.logOperation(`Update project (id: ${id})`, async () => {
      // Validate the project data
      const validatedProject = schemas.updateProjectSchema.parse(project);
      
      const collection = await getCollection<any>(this.collectionName);
      
      const now = new Date();
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id), _type: 'project' },
        { 
          $set: {
            ...validatedProject,
            updatedAt: now,
          }
        },
        { returnDocument: 'after' }
      );
      
      if (!result) {
        return null;
      }
      
      // Format all URL fields
      const formattedProject = formatItemUrls(result.value, ['imageUrl', 'thumbnailUrl', 'videoUrl']);
      
      return this.convertIdToString(formattedProject) as schemas.Project;
    });
  }

  /**
   * Delete a project
   */
  async deleteProject(id: string): Promise<boolean> {
    return this.logOperation(`Delete project (id: ${id})`, async () => {
      const collection = await getCollection<any>(this.collectionName);
      
      const result = await collection.deleteOne({
        _id: new ObjectId(id),
        _type: 'project',
      });
      
      return result.deletedCount === 1;
    });
  }

  // ==================== Case Study Operations ====================

  /**
   * Get all case studies
   */
  async getCaseStudies(featured?: boolean): Promise<schemas.CaseStudy[]> {
    return this.logOperation(`Get case studies${featured ? ' (featured)' : ''}`, async () => {
      const collection = await getCollection<any>(this.collectionName);
      
      const query = {
        _type: 'caseStudy',
        ...(featured !== undefined ? { featured } : {}),
      };
      
      const documents = await collection.find(query).sort({ order: 1 }).toArray();
      
      return documents.map(doc => this.convertIdToString(doc)) as schemas.CaseStudy[];
    });
  }

  /**
   * Get case study by ID
   */
  async getCaseStudy(id: string): Promise<schemas.CaseStudy | null> {
    return this.logOperation(`Get case study (id: ${id})`, async () => {
      const collection = await getCollection<any>(this.collectionName);
      
      const document = await collection.findOne({
        _id: new ObjectId(id),
        _type: 'caseStudy',
      });
      
      if (!document) {
        return null;
      }
      
      return this.convertIdToString(document) as schemas.CaseStudy;
    });
  }

  /**
   * Get case study by slug
   */
  async getCaseStudyBySlug(slug: string): Promise<schemas.CaseStudy | null> {
    return this.logOperation(`Get case study by slug (slug: ${slug})`, async () => {
      const collection = await getCollection<any>(this.collectionName);
      
      const document = await collection.findOne({
        slug,
        _type: 'caseStudy',
      });
      
      if (!document) {
        return null;
      }
      
      return this.convertIdToString(document) as schemas.CaseStudy;
    });
  }

  /**
   * Create a new case study
   */
  async createCaseStudy(caseStudy: schemas.InsertCaseStudy): Promise<schemas.CaseStudy> {
    return this.logOperation('Create case study', async () => {
      // Validate the case study data
      const validatedCaseStudy = schemas.insertCaseStudySchema.parse(caseStudy);
      
      const collection = await getCollection<any>(this.collectionName);
      
      const now = new Date();
      const document = {
        ...validatedCaseStudy,
        _type: 'caseStudy',
        createdAt: now,
        updatedAt: now,
      };
      
      const result = await collection.insertOne(document);
      
      if (!result.acknowledged) {
        throw new Error('Failed to create case study');
      }
      
      return {
        ...validatedCaseStudy,
        id: result.insertedId.toString(),
        createdAt: now,
        updatedAt: now,
      } as schemas.CaseStudy;
    });
  }

  /**
   * Update a case study
   */
  async updateCaseStudy(id: string, caseStudy: Partial<schemas.InsertCaseStudy>): Promise<schemas.CaseStudy | null> {
    return this.logOperation(`Update case study (id: ${id})`, async () => {
      // Validate the case study data
      const validatedCaseStudy = schemas.updateCaseStudySchema.parse(caseStudy);
      
      const collection = await getCollection<any>(this.collectionName);
      
      const now = new Date();
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id), _type: 'caseStudy' },
        { 
          $set: {
            ...validatedCaseStudy,
            updatedAt: now,
          }
        },
        { returnDocument: 'after' }
      );
      
      if (!result) {
        return null;
      }
      
      return this.convertIdToString(result) as schemas.CaseStudy;
    });
  }

  /**
   * Delete a case study
   */
  async deleteCaseStudy(id: string): Promise<boolean> {
    return this.logOperation(`Delete case study (id: ${id})`, async () => {
      const collection = await getCollection<any>(this.collectionName);
      
      const result = await collection.deleteOne({
        _id: new ObjectId(id),
        _type: 'caseStudy',
      });
      
      return result.deletedCount === 1;
    });
  }

  // ==================== AI Work Operations ====================

  /**
   * Get all AI works
   */
  async getAiWorks(featured?: boolean): Promise<schemas.AiWork[]> {
    return this.logOperation(`Get AI works${featured ? ' (featured)' : ''}`, async () => {
      const collection = await getCollection<any>(this.collectionName);
      
      const query = {
        _type: 'aiWork',
        ...(featured !== undefined ? { featured } : {}),
      };
      
      const documents = await collection.find(query).sort({ order: 1 }).toArray();
      
      return documents.map(doc => this.convertIdToString(doc)) as schemas.AiWork[];
    });
  }

  /**
   * Get AI work by ID
   */
  async getAiWork(id: string): Promise<schemas.AiWork | null> {
    return this.logOperation(`Get AI work (id: ${id})`, async () => {
      const collection = await getCollection<any>(this.collectionName);
      
      const document = await collection.findOne({
        _id: new ObjectId(id),
        _type: 'aiWork',
      });
      
      if (!document) {
        return null;
      }
      
      return this.convertIdToString(document) as schemas.AiWork;
    });
  }

  /**
   * Get AI work by slug
   */
  async getAiWorkBySlug(slug: string): Promise<schemas.AiWork | null> {
    return this.logOperation(`Get AI work by slug (slug: ${slug})`, async () => {
      const collection = await getCollection<any>(this.collectionName);
      
      const document = await collection.findOne({
        slug,
        _type: 'aiWork',
      });
      
      if (!document) {
        return null;
      }
      
      return this.convertIdToString(document) as schemas.AiWork;
    });
  }

  /**
   * Create a new AI work
   */
  async createAiWork(aiWork: schemas.InsertAiWork): Promise<schemas.AiWork> {
    return this.logOperation('Create AI work', async () => {
      // Validate the AI work data
      const validatedAiWork = schemas.insertAiWorkSchema.parse(aiWork);
      
      const collection = await getCollection<any>(this.collectionName);
      
      const now = new Date();
      const document = {
        ...validatedAiWork,
        _type: 'aiWork',
        createdAt: now,
        updatedAt: now,
      };
      
      const result = await collection.insertOne(document);
      
      if (!result.acknowledged) {
        throw new Error('Failed to create AI work');
      }
      
      return {
        ...validatedAiWork,
        id: result.insertedId.toString(),
        createdAt: now,
        updatedAt: now,
      } as schemas.AiWork;
    });
  }

  /**
   * Update an AI work
   */
  async updateAiWork(id: string, aiWork: Partial<schemas.InsertAiWork>): Promise<schemas.AiWork | null> {
    return this.logOperation(`Update AI work (id: ${id})`, async () => {
      // Validate the AI work data
      const validatedAiWork = schemas.updateAiWorkSchema.parse(aiWork);
      
      const collection = await getCollection<any>(this.collectionName);
      
      const now = new Date();
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id), _type: 'aiWork' },
        { 
          $set: {
            ...validatedAiWork,
            updatedAt: now,
          }
        },
        { returnDocument: 'after' }
      );
      
      if (!result) {
        return null;
      }
      
      return this.convertIdToString(result) as schemas.AiWork;
    });
  }

  /**
   * Delete an AI work
   */
  async deleteAiWork(id: string): Promise<boolean> {
    return this.logOperation(`Delete AI work (id: ${id})`, async () => {
      const collection = await getCollection<any>(this.collectionName);
      
      const result = await collection.deleteOne({
        _id: new ObjectId(id),
        _type: 'aiWork',
      });
      
      return result.deletedCount === 1;
    });
  }

  // ==================== Interest Operations ====================

  /**
   * Get all interests
   */
  async getInterests(category?: string, featured?: boolean): Promise<schemas.Interest[]> {
    return this.logOperation(`Get interests${category ? ` (category: ${category})` : ''}${featured ? ' (featured)' : ''}`, async () => {
      const collection = await getCollection<any>(this.collectionName);
      
      const query = {
        _type: 'interest',
        ...(category ? { category } : {}),
        ...(featured !== undefined ? { featured } : {}),
      };
      
      const documents = await collection.find(query).sort({ order: 1 }).toArray();
      
      return documents.map(doc => this.convertIdToString(doc)) as schemas.Interest[];
    });
  }

  /**
   * Get interest by ID
   */
  async getInterest(id: string): Promise<schemas.Interest | null> {
    return this.logOperation(`Get interest (id: ${id})`, async () => {
      const collection = await getCollection<any>(this.collectionName);
      
      const document = await collection.findOne({
        _id: new ObjectId(id),
        _type: 'interest',
      });
      
      if (!document) {
        return null;
      }
      
      return this.convertIdToString(document) as schemas.Interest;
    });
  }

  /**
   * Get interest by slug
   */
  async getInterestBySlug(slug: string): Promise<schemas.Interest | null> {
    return this.logOperation(`Get interest by slug (slug: ${slug})`, async () => {
      const collection = await getCollection<any>(this.collectionName);
      
      const document = await collection.findOne({
        slug,
        _type: 'interest',
      });
      
      if (!document) {
        return null;
      }
      
      return this.convertIdToString(document) as schemas.Interest;
    });
  }

  /**
   * Create a new interest
   */
  async createInterest(interest: schemas.InsertInterest): Promise<schemas.Interest> {
    return this.logOperation('Create interest', async () => {
      // Validate the interest data
      const validatedInterest = schemas.insertInterestSchema.parse(interest);
      
      const collection = await getCollection<any>(this.collectionName);
      
      const now = new Date();
      const document = {
        ...validatedInterest,
        _type: 'interest',
        createdAt: now,
        updatedAt: now,
      };
      
      const result = await collection.insertOne(document);
      
      if (!result.acknowledged) {
        throw new Error('Failed to create interest');
      }
      
      return {
        ...validatedInterest,
        id: result.insertedId.toString(),
        createdAt: now,
        updatedAt: now,
      } as schemas.Interest;
    });
  }

  /**
   * Update an interest
   */
  async updateInterest(id: string, interest: Partial<schemas.InsertInterest>): Promise<schemas.Interest | null> {
    return this.logOperation(`Update interest (id: ${id})`, async () => {
      // Validate the interest data
      const validatedInterest = schemas.updateInterestSchema.parse(interest);
      
      const collection = await getCollection<any>(this.collectionName);
      
      const now = new Date();
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id), _type: 'interest' },
        { 
          $set: {
            ...validatedInterest,
            updatedAt: now,
          }
        },
        { returnDocument: 'after' }
      );
      
      if (!result) {
        return null;
      }
      
      return this.convertIdToString(result) as schemas.Interest;
    });
  }

  /**
   * Delete an interest
   */
  async deleteInterest(id: string): Promise<boolean> {
    return this.logOperation(`Delete interest (id: ${id})`, async () => {
      const collection = await getCollection<any>(this.collectionName);
      
      const result = await collection.deleteOne({
        _id: new ObjectId(id),
        _type: 'interest',
      });
      
      return result.deletedCount === 1;
    });
  }
} 
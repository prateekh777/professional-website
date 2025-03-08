import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Professional Website',
  description: 'Learn more about me and my professional background',
}

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About Me</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">Professional Background</h2>
            <p className="text-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, 
              nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies
              nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, 
              nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">Skills</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-card p-4 rounded-lg shadow">Web Development</div>
              <div className="bg-card p-4 rounded-lg shadow">UI/UX Design</div>
              <div className="bg-card p-4 rounded-lg shadow">Project Management</div>
              <div className="bg-card p-4 rounded-lg shadow">Data Analysis</div>
              <div className="bg-card p-4 rounded-lg shadow">Content Creation</div>
              <div className="bg-card p-4 rounded-lg shadow">Digital Marketing</div>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-3">Education</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4 py-2">
                <h3 className="text-xl font-medium">Master's Degree in Computer Science</h3>
                <p className="text-muted-foreground">University Name, 2018-2020</p>
              </div>
              <div className="border-l-4 border-primary pl-4 py-2">
                <h3 className="text-xl font-medium">Bachelor's Degree in Information Technology</h3>
                <p className="text-muted-foreground">University Name, 2014-2018</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
} 
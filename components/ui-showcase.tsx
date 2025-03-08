"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Grid } from '@/components/ui/grid'
import { Flex } from '@/components/ui/flex'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, Check, Info, X } from 'lucide-react'

export function UIShowcase() {
  return (
    <Container>
      <Heading level="h1" className="mb-8">UI Component Showcase</Heading>
      
      <Tabs defaultValue="buttons" className="mb-12">
        <TabsList className="mb-4">
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
        
        {/* Buttons Tab */}
        <TabsContent value="buttons" className="space-y-8">
          <Section>
            <Heading level="h2" className="mb-6">Button Variants</Heading>
            <Flex gap="md" wrap="wrap" className="mb-8">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="success">Success</Button>
              <Button variant="warning">Warning</Button>
              <Button variant="info">Info</Button>
              <Button variant="subtle">Subtle</Button>
              <Button variant="accent">Accent</Button>
            </Flex>
            
            <Heading level="h2" className="mb-6">Button Sizes</Heading>
            <Flex gap="md" align="center" className="mb-8">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
            </Flex>
            
            <Heading level="h2" className="mb-6">Button Rounded</Heading>
            <Flex gap="md" align="center" className="mb-8">
              <Button rounded="default">Default</Button>
              <Button rounded="full">Full</Button>
              <Button rounded="none">None</Button>
            </Flex>
            
            <Heading level="h2" className="mb-6">Icon Buttons</Heading>
            <Flex gap="md" align="center">
              <Button size="icon-sm" variant="outline"><Check className="h-4 w-4" /></Button>
              <Button size="icon" variant="outline"><Check className="h-4 w-4" /></Button>
              <Button size="icon-lg" variant="outline"><Check className="h-6 w-6" /></Button>
            </Flex>
          </Section>
        </TabsContent>
        
        {/* Typography Tab */}
        <TabsContent value="typography" className="space-y-8">
          <Section>
            <Heading level="h1" className="mb-4">Heading 1</Heading>
            <Heading level="h2" className="mb-4">Heading 2</Heading>
            <Heading level="h3" className="mb-4">Heading 3</Heading>
            <Heading level="h4" className="mb-4">Heading 4</Heading>
            <Heading level="h5" className="mb-4">Heading 5</Heading>
            <Heading level="h6" className="mb-4">Heading 6</Heading>
            
            <Separator className="my-8" />
            
            <Heading level="h3" className="mb-4">Text Variants</Heading>
            <Text className="mb-2">Default text</Text>
            <Text variant="muted" className="mb-2">Muted text</Text>
            <Text variant="primary" className="mb-2">Primary text</Text>
            <Text variant="secondary" className="mb-2">Secondary text</Text>
            <Text variant="accent" className="mb-2">Accent text</Text>
            <Text variant="destructive" className="mb-2">Destructive text</Text>
            
            <Separator className="my-8" />
            
            <Heading level="h3" className="mb-4">Text Sizes</Heading>
            <Text size="xs" className="mb-2">Extra small text</Text>
            <Text size="sm" className="mb-2">Small text</Text>
            <Text size="default" className="mb-2">Default text</Text>
            <Text size="lg" className="mb-2">Large text</Text>
            <Text size="xl" className="mb-2">Extra large text</Text>
            <Text size="2xl" className="mb-2">2XL text</Text>
            
            <Separator className="my-8" />
            
            <Heading level="h3" className="mb-4">Text Weights</Heading>
            <Text weight="default" className="mb-2">Default weight</Text>
            <Text weight="medium" className="mb-2">Medium weight</Text>
            <Text weight="semibold" className="mb-2">Semibold weight</Text>
            <Text weight="bold" className="mb-2">Bold weight</Text>
          </Section>
        </TabsContent>
        
        {/* Cards Tab */}
        <TabsContent value="cards" className="space-y-8">
          <Section>
            <Heading level="h2" className="mb-6">Cards</Heading>
            <Grid cols={2} gap="lg">
              <Card>
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                  <CardDescription>Card Description</CardDescription>
                </CardHeader>
                <CardContent>
                  <Text>This is the card content where you can put any information.</Text>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button>Submit</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>User Profile</CardTitle>
                    <CardDescription>Card with avatar</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <Text>This card demonstrates using an avatar in the header.</Text>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">View Profile</Button>
                </CardFooter>
              </Card>
            </Grid>
          </Section>
        </TabsContent>
        
        {/* Forms Tab */}
        <TabsContent value="forms" className="space-y-8">
          <Section>
            <Heading level="h2" className="mb-6">Form Elements</Heading>
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Contact Form</CardTitle>
                <CardDescription>Fill out this form to get in touch.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Enter your message" rows={4} />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Submit</Button>
              </CardFooter>
            </Card>
          </Section>
        </TabsContent>
        
        {/* Layout Tab */}
        <TabsContent value="layout" className="space-y-8">
          <Section>
            <Heading level="h2" className="mb-6">Grid Layout</Heading>
            <Grid cols={3} gap="md" className="mb-8">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Card key={item} className="h-32 flex items-center justify-center">
                  <Text size="xl" weight="bold">Item {item}</Text>
                </Card>
              ))}
            </Grid>
            
            <Heading level="h2" className="mb-6">Flex Layout</Heading>
            <Flex direction="row" gap="md" align="center" justify="between" className="mb-8">
              <Card className="h-24 w-24 flex items-center justify-center">
                <Text weight="bold">1</Text>
              </Card>
              <Card className="h-24 w-24 flex items-center justify-center">
                <Text weight="bold">2</Text>
              </Card>
              <Card className="h-24 w-24 flex items-center justify-center">
                <Text weight="bold">3</Text>
              </Card>
            </Flex>
            
            <Heading level="h2" className="mb-6">Section Variants</Heading>
            <Section variant="muted" className="mb-4 p-4">
              <Text>Muted Section</Text>
            </Section>
            <Section variant="primary" className="mb-4 p-4">
              <Text>Primary Section</Text>
            </Section>
            <Section variant="secondary" className="mb-4 p-4">
              <Text>Secondary Section</Text>
            </Section>
            <Section variant="accent" className="mb-4 p-4">
              <Text>Accent Section</Text>
            </Section>
          </Section>
        </TabsContent>
        
        {/* Feedback Tab */}
        <TabsContent value="feedback" className="space-y-8">
          <Section>
            <Heading level="h2" className="mb-6">Alerts</Heading>
            <div className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Default Alert</AlertTitle>
                <AlertDescription>This is a default alert component.</AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <X className="h-4 w-4" />
                <AlertTitle>Destructive Alert</AlertTitle>
                <AlertDescription>This is a destructive alert component.</AlertDescription>
              </Alert>
              <Alert variant="success">
                <Check className="h-4 w-4" />
                <AlertTitle>Success Alert</AlertTitle>
                <AlertDescription>This is a success alert component.</AlertDescription>
              </Alert>
              <Alert variant="warning">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warning Alert</AlertTitle>
                <AlertDescription>This is a warning alert component.</AlertDescription>
              </Alert>
            </div>
            
            <Heading level="h2" className="mt-8 mb-6">Badges</Heading>
            <Flex gap="md" wrap="wrap">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="info">Info</Badge>
            </Flex>
            
            <Heading level="h2" className="mt-8 mb-6">Skeletons</Heading>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[80%]" />
              <Skeleton className="h-4 w-[60%]" />
              <div className="flex items-center space-x-4 mt-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            </div>
          </Section>
        </TabsContent>
      </Tabs>
    </Container>
  )
} 
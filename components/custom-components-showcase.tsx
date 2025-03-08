"use client"

import React, { useState } from 'react'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { MediaDisplay } from '@/components/ui/media-display'
import { CustomBadge } from '@/components/ui/custom-badge'
import { AnimatedIcon } from '@/components/ui/animated-icon'
import { GridLayout } from '@/components/ui/grid-layout'
import { CarouselDisplay } from '@/components/ui/carousel-display'
import { 
  AlertCircle, 
  Check, 
  Clock, 
  Code, 
  Heart, 
  Image as ImageIcon, 
  MessageCircle, 
  Music, 
  Star, 
  Tag, 
  Video, 
  X 
} from 'lucide-react'

export function CustomComponentsShowcase() {
  const [activeBadges, setActiveBadges] = useState<string[]>([
    'React', 'TypeScript', 'Next.js', 'TailwindCSS'
  ])
  
  const handleDismissBadge = (badge: string) => {
    setActiveBadges(activeBadges.filter(b => b !== badge))
  }
  
  // Sample data for carousel
  const carouselItems = [
    <Card key="1" className="h-64 flex items-center justify-center">
      <CardContent>
        <Heading level="h3" align="center">Slide 1</Heading>
        <Text align="center" className="mt-2">This is the first slide</Text>
      </CardContent>
    </Card>,
    <Card key="2" className="h-64 flex items-center justify-center">
      <CardContent>
        <Heading level="h3" align="center">Slide 2</Heading>
        <Text align="center" className="mt-2">This is the second slide</Text>
      </CardContent>
    </Card>,
    <Card key="3" className="h-64 flex items-center justify-center">
      <CardContent>
        <Heading level="h3" align="center">Slide 3</Heading>
        <Text align="center" className="mt-2">This is the third slide</Text>
      </CardContent>
    </Card>,
    <Card key="4" className="h-64 flex items-center justify-center">
      <CardContent>
        <Heading level="h3" align="center">Slide 4</Heading>
        <Text align="center" className="mt-2">This is the fourth slide</Text>
      </CardContent>
    </Card>,
  ]
  
  return (
    <Container>
      <Heading level="h1" className="mb-8">Custom Components Showcase</Heading>
      
      <Tabs defaultValue="media" className="mb-12">
        <TabsList className="mb-4">
          <TabsTrigger value="media">Media Display</TabsTrigger>
          <TabsTrigger value="badges">Custom Badges</TabsTrigger>
          <TabsTrigger value="icons">Animated Icons</TabsTrigger>
          <TabsTrigger value="grid">Grid Layout</TabsTrigger>
          <TabsTrigger value="carousel">Carousel</TabsTrigger>
        </TabsList>
        
        {/* Media Display Tab */}
        <TabsContent value="media" className="space-y-8">
          <Section>
            <Heading level="h2" className="mb-6">Media Display Component</Heading>
            <Text className="mb-6">
              The MediaDisplay component handles different types of media (images, videos, embeds) with appropriate fallbacks, loading states, and error handling.
            </Text>
            
            <Heading level="h3" className="mb-4">Image Example</Heading>
            <div className="mb-8">
              <MediaDisplay 
                src="https://images.unsplash.com/photo-1682687220063-4742bd7fd538"
                alt="Example image"
                aspectRatio="16:9"
                objectFit="cover"
                priority
              />
            </div>
            
            <Heading level="h3" className="mb-4">Video Example</Heading>
            <div className="mb-8">
              <MediaDisplay 
                src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
                type="video"
                aspectRatio="16:9"
                showControls
                autoPlay={false}
                loop
                muted
              />
            </div>
            
            <Heading level="h3" className="mb-4">Embed Example</Heading>
            <div>
              <MediaDisplay 
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                type="embed"
                aspectRatio="16:9"
              />
            </div>
          </Section>
        </TabsContent>
        
        {/* Custom Badges Tab */}
        <TabsContent value="badges" className="space-y-8">
          <Section>
            <Heading level="h2" className="mb-6">Custom Badge Component</Heading>
            <Text className="mb-6">
              The CustomBadge component provides enhanced badges with various styles, shapes, animations, and interactive features.
            </Text>
            
            <Heading level="h3" className="mb-4">Badge Variants</Heading>
            <div className="flex flex-wrap gap-3 mb-8">
              <CustomBadge variant="default">Default</CustomBadge>
              <CustomBadge variant="secondary">Secondary</CustomBadge>
              <CustomBadge variant="outline">Outline</CustomBadge>
              <CustomBadge variant="destructive">Destructive</CustomBadge>
              <CustomBadge variant="success">Success</CustomBadge>
              <CustomBadge variant="warning">Warning</CustomBadge>
              <CustomBadge variant="info">Info</CustomBadge>
              <CustomBadge variant="ghost">Ghost</CustomBadge>
              <CustomBadge variant="accent">Accent</CustomBadge>
            </div>
            
            <Heading level="h3" className="mb-4">Badge Sizes</Heading>
            <div className="flex flex-wrap gap-3 items-center mb-8">
              <CustomBadge size="sm">Small</CustomBadge>
              <CustomBadge size="default">Default</CustomBadge>
              <CustomBadge size="lg">Large</CustomBadge>
              <CustomBadge size="xl">Extra Large</CustomBadge>
            </div>
            
            <Heading level="h3" className="mb-4">Badge Shapes</Heading>
            <div className="flex flex-wrap gap-3 mb-8">
              <CustomBadge shape="rounded">Rounded</CustomBadge>
              <CustomBadge shape="square">Square</CustomBadge>
              <CustomBadge shape="pill">Pill</CustomBadge>
            </div>
            
            <Heading level="h3" className="mb-4">Animated Badges</Heading>
            <div className="flex flex-wrap gap-3 mb-8">
              <CustomBadge animation="pulse">Pulse</CustomBadge>
              <CustomBadge animation="bounce">Bounce</CustomBadge>
            </div>
            
            <Heading level="h3" className="mb-4">Badges with Icons</Heading>
            <div className="flex flex-wrap gap-3 mb-8">
              <CustomBadge icon={<Check className="h-3 w-3" />} iconPosition="left">
                With Icon Left
              </CustomBadge>
              <CustomBadge icon={<AlertCircle className="h-3 w-3" />} iconPosition="right" variant="warning">
                With Icon Right
              </CustomBadge>
              <CustomBadge icon={<Heart className="h-3 w-3" />} variant="destructive">
                Likes
              </CustomBadge>
              <CustomBadge icon={<MessageCircle className="h-3 w-3" />} variant="secondary">
                Comments
              </CustomBadge>
            </div>
            
            <Heading level="h3" className="mb-4">Dismissible Badges</Heading>
            <div className="flex flex-wrap gap-3">
              {activeBadges.map((badge) => (
                <CustomBadge 
                  key={badge}
                  dismissible 
                  onDismiss={() => handleDismissBadge(badge)}
                  variant="outline"
                  icon={<Tag className="h-3 w-3" />}
                >
                  {badge}
                </CustomBadge>
              ))}
              {activeBadges.length === 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setActiveBadges(['React', 'TypeScript', 'Next.js', 'TailwindCSS'])}
                >
                  Reset Badges
                </Button>
              )}
            </div>
          </Section>
        </TabsContent>
        
        {/* Animated Icons Tab */}
        <TabsContent value="icons" className="space-y-8">
          <Section>
            <Heading level="h2" className="mb-6">Animated Icon Component</Heading>
            <Text className="mb-6">
              The AnimatedIcon component provides various animation options for icons, with support for SVG paths, sprites, and Lottie animations.
            </Text>
            
            <Heading level="h3" className="mb-4">Icon Sizes</Heading>
            <div className="flex flex-wrap gap-6 items-center mb-8">
              <AnimatedIcon size="sm">
                <Star className="h-full w-full" />
              </AnimatedIcon>
              <AnimatedIcon size="md">
                <Star className="h-full w-full" />
              </AnimatedIcon>
              <AnimatedIcon size="lg">
                <Star className="h-full w-full" />
              </AnimatedIcon>
              <AnimatedIcon size="xl">
                <Star className="h-full w-full" />
              </AnimatedIcon>
              <AnimatedIcon size="2xl">
                <Star className="h-full w-full" />
              </AnimatedIcon>
            </div>
            
            <Heading level="h3" className="mb-4">Icon Animations</Heading>
            <div className="flex flex-wrap gap-6 items-center mb-8">
              <AnimatedIcon size="lg" animation="pulse">
                <Heart className="h-full w-full" />
              </AnimatedIcon>
              <AnimatedIcon size="lg" animation="spin">
                <Clock className="h-full w-full" />
              </AnimatedIcon>
              <AnimatedIcon size="lg" animation="bounce">
                <AlertCircle className="h-full w-full" />
              </AnimatedIcon>
              <AnimatedIcon size="lg" animation="ping">
                <MessageCircle className="h-full w-full" />
              </AnimatedIcon>
            </div>
            
            <Heading level="h3" className="mb-4">Icon Colors</Heading>
            <div className="flex flex-wrap gap-6 items-center mb-8">
              <AnimatedIcon size="lg" color="default">
                <Star className="h-full w-full" />
              </AnimatedIcon>
              <AnimatedIcon size="lg" color="primary">
                <Star className="h-full w-full" />
              </AnimatedIcon>
              <AnimatedIcon size="lg" color="secondary">
                <Star className="h-full w-full" />
              </AnimatedIcon>
              <AnimatedIcon size="lg" color="accent">
                <Star className="h-full w-full" />
              </AnimatedIcon>
              <AnimatedIcon size="lg" color="destructive">
                <Star className="h-full w-full" />
              </AnimatedIcon>
              <AnimatedIcon size="lg" color="success">
                <Star className="h-full w-full" />
              </AnimatedIcon>
            </div>
            
            <Heading level="h3" className="mb-4">Icon Hover Effects</Heading>
            <div className="flex flex-wrap gap-6 items-center mb-8">
              <AnimatedIcon size="lg" hover="grow">
                <Star className="h-full w-full" />
              </AnimatedIcon>
              <AnimatedIcon size="lg" hover="shrink">
                <Star className="h-full w-full" />
              </AnimatedIcon>
              <AnimatedIcon size="lg" hover="rotate">
                <Star className="h-full w-full" />
              </AnimatedIcon>
              <AnimatedIcon size="lg" hover="color">
                <Star className="h-full w-full" />
              </AnimatedIcon>
            </div>
            
            <Heading level="h3" className="mb-4">SVG Path Icons</Heading>
            <div className="flex flex-wrap gap-6 items-center">
              <AnimatedIcon 
                size="lg" 
                svgPath="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill
                color="warning"
              />
              <AnimatedIcon 
                size="lg" 
                svgPath="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                fill
                color="success"
              />
              <AnimatedIcon 
                size="lg" 
                svgPath="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
                animation="bounce"
                color="success"
              />
            </div>
          </Section>
        </TabsContent>
        
        {/* Grid Layout Tab */}
        <TabsContent value="grid" className="space-y-8">
          <Section>
            <Heading level="h2" className="mb-6">Grid Layout Component</Heading>
            <Text className="mb-6">
              The GridLayout component provides a flexible and responsive grid system with various configuration options.
            </Text>
            
            <Heading level="h3" className="mb-4">Basic Grid (3 Columns)</Heading>
            <GridLayout cols={3} gap="md" className="mb-8">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Card key={item} className="h-32 flex items-center justify-center">
                  <CardContent>
                    <Text size="xl" weight="bold" align="center">Item {item}</Text>
                  </CardContent>
                </Card>
              ))}
            </GridLayout>
            
            <Heading level="h3" className="mb-4">Grid with Different Gaps</Heading>
            <GridLayout cols={2} gap="lg" className="mb-8">
              {[1, 2, 3, 4].map((item) => (
                <Card key={item} className="h-32 flex items-center justify-center">
                  <CardContent>
                    <Text size="xl" weight="bold" align="center">Item {item}</Text>
                  </CardContent>
                </Card>
              ))}
            </GridLayout>
            
            <Heading level="h3" className="mb-4">Auto-Fit Grid</Heading>
            <GridLayout layout="autoFit" minItemWidth={200} gap="md" className="mb-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <Card key={item} className="h-32 flex items-center justify-center">
                  <CardContent>
                    <Text size="xl" weight="bold" align="center">Item {item}</Text>
                  </CardContent>
                </Card>
              ))}
            </GridLayout>
            
            <Heading level="h3" className="mb-4">Grid with Custom Template</Heading>
            <GridLayout 
              cols="custom" 
              gridTemplateColumns="1fr 2fr 1fr" 
              gap="md"
              className="mb-8"
            >
              <Card className="h-32 flex items-center justify-center">
                <CardContent>
                  <Text size="xl" weight="bold" align="center">1fr</Text>
                </CardContent>
              </Card>
              <Card className="h-32 flex items-center justify-center">
                <CardContent>
                  <Text size="xl" weight="bold" align="center">2fr</Text>
                </CardContent>
              </Card>
              <Card className="h-32 flex items-center justify-center">
                <CardContent>
                  <Text size="xl" weight="bold" align="center">1fr</Text>
                </CardContent>
              </Card>
            </GridLayout>
            
            <Heading level="h3" className="mb-4">Grid with Areas</Heading>
            <GridLayout 
              cols="custom" 
              gridTemplateColumns="1fr 1fr 1fr" 
              gridTemplateRows="auto auto"
              gridTemplateAreas={`
                "header header header"
                "sidebar main main"
              `}
              gap="md"
            >
              <Card style={{ gridArea: 'header' }} className="h-32 flex items-center justify-center">
                <CardContent>
                  <Text size="xl" weight="bold" align="center">Header</Text>
                </CardContent>
              </Card>
              <Card style={{ gridArea: 'sidebar' }} className="h-64 flex items-center justify-center">
                <CardContent>
                  <Text size="xl" weight="bold" align="center">Sidebar</Text>
                </CardContent>
              </Card>
              <Card style={{ gridArea: 'main' }} className="h-64 flex items-center justify-center">
                <CardContent>
                  <Text size="xl" weight="bold" align="center">Main Content</Text>
                </CardContent>
              </Card>
            </GridLayout>
          </Section>
        </TabsContent>
        
        {/* Carousel Tab */}
        <TabsContent value="carousel" className="space-y-8">
          <Section>
            <Heading level="h2" className="mb-6">Carousel Display Component</Heading>
            <Text className="mb-6">
              The CarouselDisplay component provides a flexible and customizable carousel for showcasing multiple items.
            </Text>
            
            <Heading level="h3" className="mb-4">Basic Carousel</Heading>
            <div className="mb-12">
              <CarouselDisplay 
                className="border rounded-lg overflow-hidden"
                size="full"
                navigation="both"
                autoplay={false}
                loop={true}
                showArrows={true}
              >
                {carouselItems.map((item, index) => (
                  <div key={index} className="w-full h-64 flex items-center justify-center">
                    {item}
                  </div>
                ))}
              </CarouselDisplay>
            </div>
            
            <Heading level="h3" className="mb-4">Multiple Items Carousel</Heading>
            <div className="mb-12">
              <CarouselDisplay 
                className="border rounded-lg overflow-hidden"
                size="full"
                navigation="both"
                autoplay={false}
                loop={true}
                showArrows={true}
              >
                {carouselItems.map((item, index) => (
                  <div key={index} className="w-full h-64 flex items-center justify-center">
                    {item}
                  </div>
                ))}
              </CarouselDisplay>
            </div>
            
            <Heading level="h3" className="mb-4">Fade Effect Carousel</Heading>
            <div className="mb-12">
              <CarouselDisplay 
                className="border rounded-lg overflow-hidden"
                size="full"
                navigation="both"
                autoplay={false}
                loop={true}
                showArrows={true}
              >
                {carouselItems.map((item, index) => (
                  <div key={index} className="w-full h-64 flex items-center justify-center">
                    {item}
                  </div>
                ))}
              </CarouselDisplay>
            </div>
            
            <Heading level="h3" className="mb-4">Autoplay Carousel</Heading>
            <div className="mb-12">
              <CarouselDisplay 
                className="border rounded-lg overflow-hidden"
                size="full"
                navigation="dots"
                autoplay={true}
                autoplayInterval={3000}
                loop={true}
                showArrows={false}
              >
                {carouselItems.map((item, index) => (
                  <div key={index} className="w-full h-64 flex items-center justify-center">
                    {item}
                  </div>
                ))}
              </CarouselDisplay>
            </div>
          </Section>
        </TabsContent>
      </Tabs>
    </Container>
  )
} 
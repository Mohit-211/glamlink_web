import BlogGrid from '@/components/blogs/BlogGrid'
import CategoryNav from '@/components/blogs/CategoryNav'
import HeroSection from '@/components/blogs/HeroSection'
const Journal = () => {
  return (
    <main className="flex-1">
      <HeroSection />
      <CategoryNav />
      <BlogGrid />
    </main>
  )
}
export default Journal
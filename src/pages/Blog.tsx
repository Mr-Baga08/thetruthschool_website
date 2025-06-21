import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, User, ArrowRight, Search, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BackgroundAnimation from "@/components/BackgroundAnimation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Mock blog data - In a real app, this would come from a CMS or API
const blogPosts = [
//   {
//     id: 1,
//     title: "The Truth About Technical Interviews: What Hiring Managers Actually Look For",
//     excerpt: "Discover the hidden criteria that determine who gets hired, beyond just coding skills. Learn what separates successful candidates from the rest.",
//     content: "Technical interviews can feel like a black box, but after speaking with hiring managers from top tech companies, we've uncovered what they really evaluate...",
//     author: "Sarah Chen",
//     date: "2024-12-15",
//     readTime: "8 min read",
//     category: "Interview Tips",
//     tags: ["Technical Interviews", "Hiring", "Career Advice"],
//     featured: true
//   },
//   {
//     id: 2,
//     title: "Resume Red Flags: 5 Mistakes That Kill Your Chances Before the Interview",
//     excerpt: "These common resume mistakes immediately disqualify candidates. Learn how to avoid them and make your resume stand out to ATS systems and human reviewers.",
//     content: "Your resume has exactly 6 seconds to make an impression. Here's what instantly turns off recruiters and how to fix it...",
//     author: "Marcus Rodriguez",
//     date: "2024-12-12",
//     readTime: "6 min read",
//     category: "Resume Tips",
//     tags: ["Resume", "ATS", "Job Search"],
//     featured: false
//   },
//   {
//     id: 3,
//     title: "AI is Changing Hiring: How to Prepare for Algorithm-Driven Recruitment",
//     excerpt: "Companies are increasingly using AI to screen candidates. Here's how to optimize your application for both human and artificial intelligence reviewers.",
//     content: "The recruitment landscape is evolving rapidly with AI playing an increasingly important role. Here's what you need to know...",
//     author: "Dr. Alex Thompson",
//     date: "2024-12-10",
//     readTime: "10 min read",
//     category: "Industry Trends",
//     tags: ["AI", "Recruitment", "Future of Work"],
//     featured: true
//   },
//   {
//     id: 4,
//     title: "Salary Negotiation Scripts That Actually Work",
//     excerpt: "Tired of leaving money on the table? These proven scripts and strategies help you negotiate offers with confidence and get the compensation you deserve.",
//     content: "Salary negotiation doesn't have to be intimidating. With the right approach and these tested scripts, you can confidently negotiate better offers...",
//     author: "Jennifer Park",
//     date: "2024-12-08",
//     readTime: "12 min read",
//     category: "Career Growth",
//     tags: ["Salary", "Negotiation", "Career Advice"],
//     featured: false
//   },
//   {
//     id: 5,
//     title: "The Hidden Job Market: How to Find Opportunities That Aren't Posted",
//     excerpt: "80% of jobs are never publicly advertised. Learn the strategies top professionals use to access the hidden job market and land dream roles.",
//     content: "The best opportunities often come through networks and relationships, not job boards. Here's how to tap into the hidden job market...",
//     author: "David Kim",
//     date: "2024-12-05",
//     readTime: "9 min read",
//     category: "Job Search",
//     tags: ["Networking", "Job Search", "Hidden Jobs"],
//     featured: false
//   },
//   {
//     id: 6,
//     title: "Building Your Personal Brand: Why Developers Need to Think Like Marketers",
//     excerpt: "In today's competitive market, technical skills alone aren't enough. Learn how to build a personal brand that opens doors and accelerates your career.",
//     content: "Personal branding isn't just for influencers. For developers and tech professionals, a strong personal brand can be the difference between...",
//     author: "Rachel Foster",
//     date: "2024-12-03",
//     readTime: "7 min read",
//     category: "Personal Branding",
//     tags: ["Personal Brand", "Career Development", "Marketing"],
//     featured: false
//   }
];

const categories = ["All", "Interview Tips", "Resume Tips", "Career Growth", "Job Search", "Industry Trends", "Personal Branding"];

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const BlogCard = ({ post, featured = false }: { post: typeof blogPosts[0], featured?: boolean }) => (
    <div className={`bg-charcoal/50 border border-medium-gray/20 rounded-lg p-6 hover:border-muted-gold/40 transition-all duration-300 glow-hover ${featured ? 'md:col-span-2' : ''}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Badge variant="outline" className="border-vibrant-gold text-vibrant-gold">
          {post.category}
        </Badge>
        {featured && (
          <Badge className="bg-vibrant-gold text-charcoal">
            Featured
          </Badge>
        )}
      </div>
      
      <h3 className={`font-bold text-off-white mb-3 leading-tight ${featured ? 'text-2xl' : 'text-xl'}`}>
        {post.title}
      </h3>
      
      <p className="text-medium-gray mb-4 leading-relaxed">
        {post.excerpt}
      </p>
      
      <div className="flex items-center justify-between text-sm text-medium-gray mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1" />
            {post.author}
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(post.date).toLocaleDateString()}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {post.readTime}
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map(tag => (
            <span key={tag} className="text-xs bg-medium-gray/20 text-medium-gray px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
        
        <Button 
          variant="ghost" 
          className="text-vibrant-gold hover:text-vibrant-gold/80 p-0"
          onClick={() => {/* Navigate to full post */}}
        >
          Read More
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-charcoal text-off-white relative overflow-x-hidden">
      <BackgroundAnimation />
      <Header />
      
      <div className="container mx-auto px-6 py-20 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <Button 
            variant="ghost"
            onClick={() => navigate('/')}
            className=" mb-4 sm:mt-6 text-muted-gold hover:text-gray-700 font-semibold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <h1 className="text-5xl md:text-6xl font-bold text-off-white mb-6">
            The Truth{' '}
            <span className="text-vibrant-gold">Blog</span>
          </h1>
          
          <p className="text-xl text-medium-gray max-w-3xl mx-auto leading-relaxed">
            Honest insights, proven strategies, and real-world advice to help you navigate 
            your career and land your dream job. No fluff, just actionable truth.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-medium-gray w-5 h-5" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-charcoal border-medium-gray text-off-white placeholder:text-medium-gray pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`${
                    selectedCategory === category 
                      ? 'bg-vibrant-gold text-charcoal hover:bg-vibrant-gold/90' 
                      : 'border-medium-gray text-medium-gray hover:border-vibrant-gold hover:text-gray-900'
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-off-white mb-8">Featured Articles</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map(post => (
                <BlogCard key={post.id} post={post} featured />
              ))}
            </div>
          </div>
        )}

        {/* Regular Posts */}
        {regularPosts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-off-white mb-8">
              {featuredPosts.length > 0 ? 'More Articles' : 'Latest Articles'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-off-white mb-4">No articles found</h3>
            <p className="text-medium-gray mb-8">
              Try adjusting your search terms or filter criteria.
            </p>
            <Button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
              className="bg-vibrant-gold text-charcoal hover:bg-vibrant-gold/90"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-20 bg-charcoal/50 border border-medium-gray/20 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-off-white mb-4">
            Never Miss an Update
          </h3>
          <p className="text-medium-gray mb-6 max-w-2xl mx-auto">
            Get the latest career insights and job search strategies delivered directly to your inbox. 
            Join thousands of professionals advancing their careers with TheTruthSchool.
          </p>
          <Button 
            onClick={() => navigate('/newsletter')}
            className="bg-vibrant-gold text-charcoal hover:bg-vibrant-gold/90 font-semibold glow-hover"
          >
            Subscribe to Newsletter
          </Button>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Blog;
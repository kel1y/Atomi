export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  date: string
  category: string
  likes: number
  comments: number
  image: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  image: string
  email: string
}

export const mockBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Future of Nuclear Energy in Africa",
    slug: "future-nuclear-energy-africa",
    excerpt: "Exploring how nuclear energy can transform Africa's energy landscape and drive sustainable development.",
    content:
      "Nuclear energy represents a transformative opportunity for Africa. With growing energy demands and the need for clean power sources, nuclear technology offers a reliable, carbon-free solution. Rwanda is positioned to lead this revolution in East Africa...",
    author: "Dr. Jean Mukamana",
    date: "2024-10-15",
    category: "Energy",
    likes: 234,
    comments: 12,
    image: "/nuclear-energy-facility.jpg",
  },
  {
    id: "2",
    title: "Safety Standards in Modern Nuclear Plants",
    slug: "safety-standards-nuclear-plants",
    excerpt:
      "Understanding the rigorous safety protocols that make modern nuclear facilities among the safest energy sources.",
    content:
      "Modern nuclear plants operate under the strictest safety standards in the energy industry. Multiple redundant systems, continuous monitoring, and rigorous training ensure that nuclear energy remains one of the safest power generation methods...",
    author: "Eng. Paul Nkurunziza",
    date: "2024-10-08",
    category: "Safety",
    likes: 189,
    comments: 8,
    image: "/nuclear-safety-control-room.jpg",
  },
  {
    id: "3",
    title: "Rwanda's Path to Energy Independence",
    slug: "rwanda-energy-independence",
    excerpt: "How ATOMi is contributing to Rwanda's vision of becoming a regional energy hub.",
    content:
      "Rwanda has set ambitious goals for energy independence and regional leadership. Nuclear energy plays a crucial role in this strategy, providing stable, baseload power that complements renewable sources like hydroelectric and solar...",
    author: "Dr. Marie Uwase",
    date: "2024-09-30",
    category: "Policy",
    likes: 312,
    comments: 15,
    image: "/rwanda-landscape-energy.jpg",
  },
]

export const mockTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Dr. Jean Mukamana",
    role: "Chief Executive Officer",
    bio: "PhD in Nuclear Physics with 20+ years of experience in energy policy and nuclear technology development.",
    image: "/professional-headshot.png",
    email: "jean@atomi.rw",
  },
  {
    id: "2",
    name: "Eng. Paul Nkurunziza",
    role: "Chief Technology Officer",
    bio: "Expert in nuclear reactor design and safety systems with extensive international experience.",
    image: "/professional-headshot.png",
    email: "paul@atomi.rw",
  },
  {
    id: "3",
    name: "Dr. Marie Uwase",
    role: "Head of Research & Development",
    bio: "Leading research initiatives in advanced reactor technologies and sustainable energy solutions.",
    image: "/professional-headshot.png",
    email: "marie@atomi.rw",
  },
  {
    id: "4",
    name: "James Habimana",
    role: "Director of Operations",
    bio: "Oversees all operational aspects with a focus on efficiency and safety excellence.",
    image: "/professional-headshot.png",
    email: "james@atomi.rw",
  },
]

"use client"

import { mockBlogPosts, mockTeamMembers } from "@/lib/mock-data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"

export default function AdminDashboard() {
  const totalPosts = mockBlogPosts.length
  const totalComments = mockBlogPosts.reduce((sum, post) => sum + post.comments, 0)
  const totalLikes = mockBlogPosts.reduce((sum, post) => sum + post.likes, 0)
  const teamMembers = mockTeamMembers.length

  const chartData = mockBlogPosts.map((post) => ({
    name: post.title.substring(0, 15),
    likes: post.likes,
    comments: post.comments,
  }))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-foreground/70">Welcome back! Here's your site overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-background border border-border">
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground/60">Total Posts</p>
            <p className="text-3xl font-bold">{totalPosts}</p>
            <p className="text-xs text-foreground/50">Published articles</p>
          </div>
        </Card>

        <Card className="p-6 bg-background border border-border">
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground/60">Total Comments</p>
            <p className="text-3xl font-bold">{totalComments}</p>
            <p className="text-xs text-foreground/50">Across all posts</p>
          </div>
        </Card>

        <Card className="p-6 bg-background border border-border">
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground/60">Total Likes</p>
            <p className="text-3xl font-bold">{totalLikes}</p>
            <p className="text-xs text-foreground/50">Community engagement</p>
          </div>
        </Card>

        <Card className="p-6 bg-background border border-border">
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground/60">Team Members</p>
            <p className="text-3xl font-bold">{teamMembers}</p>
            <p className="text-xs text-foreground/50">Active staff</p>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-background border border-border">
          <h2 className="text-lg font-semibold mb-4">Post Engagement</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-foreground)" />
              <YAxis stroke="var(--color-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-background)",
                  border: "1px solid var(--color-border)",
                }}
              />
              <Bar dataKey="likes" fill="var(--color-primary)" />
              <Bar dataKey="comments" fill="var(--color-muted-foreground)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 bg-background border border-border">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {mockBlogPosts.slice(0, 5).map((post) => (
              <div key={post.id} className="flex justify-between items-start pb-4 border-b border-border last:border-0">
                <div className="flex-1">
                  <p className="font-medium text-sm line-clamp-1">{post.title}</p>
                  <p className="text-xs text-foreground/60">{post.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{post.likes}</p>
                  <p className="text-xs text-foreground/60">likes</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

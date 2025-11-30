'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Textarea } from '@/components/ui'
import { Settings, User, FileText, Heart, Download } from 'lucide-react'
import { Profile, Spec } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [specs, setSpecs] = useState<Spec[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ display_name: '', bio: '' })

  useEffect(() => {
    fetchProfile()
    fetchUserSpecs()
  }, [])

  const fetchProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error

      setProfile(data)
      setEditForm({
        display_name: data.display_name || '',
        bio: data.bio || '',
      })
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserSpecs = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const response = await fetch(`/api/feed?created_by=${user.id}`)
      if (response.ok) {
        const data = await response.json()
        setSpecs(data.specs || [])
      }
    } catch (error) {
      console.error('Error fetching user specs:', error)
    }
  }

  const updateProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: editForm.display_name,
          bio: editForm.bio,
        })
        .eq('id', user.id)

      if (error) throw error

      setEditing(false)
      fetchProfile()
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-cherry-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-400 mb-4">Profile not found</p>
            <Button onClick={() => router.push('/')}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = {
    specs: specs.length,
    upvotes: specs.reduce((sum, s) => sum + s.upvote_count, 0),
    downloads: specs.reduce((sum, s) => sum + s.download_count, 0),
  }

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Profile</h1>
          <div className="flex gap-3">
            <Link href="/profile/settings">
              <Button variant="outline" leftIcon={<Settings className="w-4 h-4" />}>
                Settings
              </Button>
            </Link>
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-8">
            {editing ? (
              <div className="space-y-4">
                <Input
                  label="Display Name"
                  value={editForm.display_name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, display_name: e.target.value })
                  }
                />
                <Textarea
                  label="Bio"
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                />
                <div className="flex gap-3">
                  <Button onClick={updateProfile}>Save</Button>
                  <Button variant="ghost" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-full bg-cherry-500/20 flex items-center justify-center text-2xl">
                  {profile.display_name?.[0]?.toUpperCase() || profile.username[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-1">
                    {profile.display_name || profile.username}
                  </h2>
                  <p className="text-gray-400 mb-2">@{profile.username}</p>
                  {profile.bio && <p className="text-gray-300">{profile.bio}</p>}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => setEditing(true)}
                  >
                    Edit Profile
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="w-8 h-8 text-cherry-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">{stats.specs}</div>
              <div className="text-sm text-gray-400">Specs Created</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="w-8 h-8 text-cherry-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">{stats.upvotes}</div>
              <div className="text-sm text-gray-400">Total Upvotes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Download className="w-8 h-8 text-cherry-400 mx-auto mb-2" />
              <div className="text-3xl font-bold text-white mb-1">{stats.downloads}</div>
              <div className="text-sm text-gray-400">Total Downloads</div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-white mb-4">Your Specs</h3>
          {specs.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">No specs yet</p>
                <Link href="/writer">
                  <Button>Create Your First Spec</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {specs.map((spec) => (
                <Link key={spec.id} href={`/specs/${spec.id}`}>
                  <Card variant="interactive">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-white mb-2 line-clamp-1">
                        {spec.title}
                      </h4>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-3">
                        {spec.description || 'No description'}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{spec.upvote_count} upvotes</span>
                        <span className="capitalize">{spec.category.replace('-', ' ')}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { WriterState } from '@/lib/types'
import { Button, Card, CardContent } from '@/components/ui'
import { Download, Copy, Check, Share2, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface StepFiveProps {
  state: WriterState
  generatedSpec: string
  onNewSpec: () => void
}

export function StepFive({ state, generatedSpec, onNewSpec }: StepFiveProps) {
  const router = useRouter()
  const supabase = createClient()
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const downloadSpec = () => {
    const blob = new Blob([generatedSpec], {
      type: state.specType === 'markdown' ? 'text/markdown' : 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${state.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${
      state.specType === 'markdown' ? 'md' : 'json'
    }`
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedSpec)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const saveToLibrary = async () => {
    setSaving(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { error } = await supabase.from('specs').insert({
        created_by: user.id,
        title: state.title,
        description: state.description,
        spec_type: state.specType,
        content: generatedSpec,
        category: state.category!,
        difficulty: state.difficulty || 'production',
        tags: [],
        vibe: state.vibe,
        is_public: false,
      })

      if (error) throw error

      setSaved(true)
    } catch (err) {
      console.error('Error saving spec:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Your Spec is Ready! 🎉</h2>
        <p className="text-gray-400">
          Download, copy, or save your specification to your library.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="bg-dark-900 rounded-lg p-4 border border-dark-700 mb-4 max-h-96 overflow-y-auto">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
              {generatedSpec}
            </pre>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={downloadSpec} leftIcon={<Download className="w-4 h-4" />}>
              Download
            </Button>
            <Button
              variant="secondary"
              onClick={copyToClipboard}
              leftIcon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
            <Button
              variant="outline"
              onClick={saveToLibrary}
              loading={saving}
              disabled={saved}
              leftIcon={saved ? <Check className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            >
              {saved ? 'Saved!' : 'Save to Library'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onNewSpec}>
          Create Another Spec
        </Button>
        <Button onClick={() => router.push('/feed')}>
          Browse Feed
        </Button>
      </div>
    </div>
  )
}


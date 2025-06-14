import { useEffect } from 'react'
import { useSettingsStore } from '@/store'
import Button from '@/components/ui/Button'
import Toggle from '@/components/ui/Toggle'

export default function ContentSettings() {
  const { 
    contentSettings, 
    isLoading, 
    isSaving, 
    saveStatus,
    error,
    fetchSettings,
    updateContentSettings,
    saveSettings 
  } = useSettingsStore()

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleSave = () => {
    saveSettings()
  }

  if (isLoading && !contentSettings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-400"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-error-100 border border-error-500 text-error-500 px-4 py-3 rounded">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Settings</h1>
          <p className="text-gray-600 mt-1">Configure AI content generation parameters</p>
        </div>
        
        <Button
          onClick={handleSave}
          isLoading={isSaving}
          disabled={!contentSettings}
          variant={saveStatus === 'success' ? 'secondary' : 'primary'}
        >
          {saveStatus === 'success' ? 'Saved ✅' : 
           saveStatus === 'error' ? 'Error ❌' : 
           'Save Changes'}
        </Button>
      </div>

      {/* Content Types */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Content Types</h2>
        <p className="text-gray-600 mb-6">Select which types of content to generate</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Toggle
            enabled={contentSettings?.enabled_types.facts || false}
            onChange={(enabled) => updateContentSettings({
              enabled_types: { 
                quotes: false,
                memes: false,
                location: false,
                educational: false,
                custom: false,
                ...contentSettings?.enabled_types, 
                facts: enabled 
              }
            })}
            label="Facts & Trivia"
            description="Interesting facts and trivia posts"
          />
          
          <Toggle
            enabled={contentSettings?.enabled_types.quotes || false}
            onChange={(enabled) => updateContentSettings({
              enabled_types: { ...contentSettings?.enabled_types, quotes: enabled }
            })}
            label="Motivational Quotes"
            description="Inspirational and motivational content"
          />
          
          <Toggle
            enabled={contentSettings?.enabled_types.memes || false}
            onChange={(enabled) => updateContentSettings({
              enabled_types: { ...contentSettings?.enabled_types, memes: enabled }
            })}
            label="Memes & Humor"
            description="Funny and entertaining content"
          />
          
          <Toggle
            enabled={contentSettings?.enabled_types.location || false}
            onChange={(enabled) => updateContentSettings({
              enabled_types: { ...contentSettings?.enabled_types, location: enabled }
            })}
            label="Location Content"
            description="Location-based posts and recommendations"
          />
          
          <Toggle
            enabled={contentSettings?.enabled_types.educational || false}
            onChange={(enabled) => updateContentSettings({
              enabled_types: { ...contentSettings?.enabled_types, educational: enabled }
            })}
            label="Educational Tips"
            description="How-to guides and educational content"
          />
          
          <Toggle
            enabled={contentSettings?.enabled_types.custom || false}
            onChange={(enabled) => updateContentSettings({
              enabled_types: { ...contentSettings?.enabled_types, custom: enabled }
            })}
            label="Custom Prompts"
            description="User-defined custom content"
          />
        </div>
      </div>

      {/* AI Configuration */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">AI Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model Selection
            </label>
            <select 
              className="input-field"
              value={contentSettings?.ai_config.model || 'gpt-4'}
              onChange={(e) => updateContentSettings({
                ai_config: { ...contentSettings?.ai_config, model: e.target.value as any }
              })}
            >
              <option value="gpt-4">GPT-4</option>
              <option value="claude">Claude</option>
              <option value="gemini">Gemini</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content Length
            </label>
            <div className="flex space-x-4">
              {['short', 'medium', 'long'].map((length) => (
                <label key={length} className="flex items-center">
                  <input
                    type="radio"
                    name="content_length"
                    value={length}
                    checked={contentSettings?.ai_config.content_length === length}
                    onChange={(e) => updateContentSettings({
                      ai_config: { ...contentSettings?.ai_config, content_length: e.target.value as any }
                    })}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700 capitalize">{length}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Creativity Level: {contentSettings?.ai_config.creativity_level || 70}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={contentSettings?.ai_config.creativity_level || 70}
              onChange={(e) => updateContentSettings({
                ai_config: { ...contentSettings?.ai_config, creativity_level: parseInt(e.target.value) }
              })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Conservative</span>
              <span>Creative</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select 
              className="input-field"
              value={contentSettings?.ai_config.language || 'English'}
              onChange={(e) => updateContentSettings({
                ai_config: { ...contentSettings?.ai_config, language: e.target.value }
              })}
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Italian">Italian</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Instructions (Optional)
          </label>
          <textarea
            rows={3}
            placeholder="Add any specific instructions for content generation..."
            className="input-field"
            value={contentSettings?.ai_config.custom_instructions || ''}
            onChange={(e) => updateContentSettings({
              ai_config: { ...contentSettings?.ai_config, custom_instructions: e.target.value }
            })}
          />
        </div>
      </div>

      {/* Trending Sources */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Trending Data Sources</h2>
        <p className="text-gray-600 mb-6">Select sources for trending topics</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Toggle
            enabled={contentSettings?.trending_sources.google_trends || false}
            onChange={(enabled) => updateContentSettings({
              trending_sources: { ...contentSettings?.trending_sources, google_trends: enabled }
            })}
            label="Google Trends"
            description="Popular search topics"
          />
          
          <Toggle
            enabled={contentSettings?.trending_sources.tiktok_discovery || false}
            onChange={(enabled) => updateContentSettings({
              trending_sources: { ...contentSettings?.trending_sources, tiktok_discovery: enabled }
            })}
            label="TikTok Discovery"
            description="Trending TikTok content"
          />
          
          <Toggle
            enabled={contentSettings?.trending_sources.instagram_explore || false}
            onChange={(enabled) => updateContentSettings({
              trending_sources: { ...contentSettings?.trending_sources, instagram_explore: enabled }
            })}
            label="Instagram Explore"
            description="Instagram trending content"
          />
          
          <Toggle
            enabled={contentSettings?.trending_sources.twitter_trending || false}
            onChange={(enabled) => updateContentSettings({
              trending_sources: { ...contentSettings?.trending_sources, twitter_trending: enabled }
            })}
            label="Twitter Trending"
            description="Twitter trending topics"
          />
          
          <Toggle
            enabled={contentSettings?.trending_sources.reddit_hot || false}
            onChange={(enabled) => updateContentSettings({
              trending_sources: { ...contentSettings?.trending_sources, reddit_hot: enabled }
            })}
            label="Reddit Hot"
            description="Popular Reddit posts"
          />
          
          <Toggle
            enabled={contentSettings?.trending_sources.youtube_trending || false}
            onChange={(enabled) => updateContentSettings({
              trending_sources: { ...contentSettings?.trending_sources, youtube_trending: enabled }
            })}
            label="YouTube Trending"
            description="Trending YouTube videos"
          />
        </div>
      </div>

      {/* Media Settings */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Media Generation</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Style
            </label>
            <select 
              className="input-field"
              value={contentSettings?.media_settings.image_style || 'Realistic'}
              onChange={(e) => updateContentSettings({
                media_settings: { ...contentSettings?.media_settings, image_style: e.target.value }
              })}
            >
              <option value="Realistic">Realistic</option>
              <option value="Artistic">Artistic</option>
              <option value="Minimalist">Minimalist</option>
              <option value="Cartoon">Cartoon</option>
              <option value="Abstract">Abstract</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Voice Provider
            </label>
            <select 
              className="input-field"
              value={contentSettings?.media_settings.voice_provider || 'ElevenLabs'}
              onChange={(e) => updateContentSettings({
                media_settings: { ...contentSettings?.media_settings, voice_provider: e.target.value }
              })}
            >
              <option value="ElevenLabs">ElevenLabs</option>
              <option value="Azure">Azure Speech</option>
              <option value="Google">Google Text-to-Speech</option>
              <option value="Amazon">Amazon Polly</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video Length Range: {contentSettings?.media_settings.video_length_range?.[0] || 15}s - {contentSettings?.media_settings.video_length_range?.[1] || 30}s
            </label>
            <input
              type="range"
              min="10"
              max="60"
              value={contentSettings?.media_settings.video_length_range?.[1] || 30}
              onChange={(e) => updateContentSettings({
                media_settings: { 
                  ...contentSettings?.media_settings, 
                  video_length_range: [15, parseInt(e.target.value)]
                }
              })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10s</span>
              <span>60s</span>
            </div>
          </div>
          
          <div>
            <Toggle
              enabled={contentSettings?.media_settings.background_music || false}
              onChange={(enabled) => updateContentSettings({
                media_settings: { ...contentSettings?.media_settings, background_music: enabled }
              })}
              label="Background Music"
              description="Add background music to videos"
            />
          </div>
        </div>
      </div>
    </div>
  )
} 
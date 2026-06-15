import type { MappedCharacter } from '../types'
import { TypePreview } from './TypePreview'
import './ComparisonPreview.css'

interface ComparisonPreviewProps {
  mapped: MappedCharacter[]
  missingChars: string[]
  animationKey: number
  onReplace?: (char: string) => void
}

export function ComparisonPreview({ mapped, missingChars, animationKey, onReplace }: ComparisonPreviewProps) {
  return (
    <div className="comparison-preview">
      <div className="comparison-preview__pane">
        <div className="comparison-preview__pane-label">横排</div>
        <TypePreview
          mapped={mapped}
          writingMode="horizontal"
          missingChars={missingChars}
          animationKey={animationKey}
          onReplace={onReplace}
        />
      </div>
      <div className="comparison-preview__divider" />
      <div className="comparison-preview__pane">
        <div className="comparison-preview__pane-label">竖排</div>
        <TypePreview
          mapped={mapped}
          writingMode="vertical"
          missingChars={missingChars}
          animationKey={animationKey}
          onReplace={onReplace}
        />
      </div>
    </div>
  )
}

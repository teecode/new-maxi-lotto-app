import { useState } from 'react'
import { toast } from 'sonner'
import { CheckIcon, CopyIcon, Gift, Loader2, Share2, Users, LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { User } from '@/types/user'
import { requestReferral } from '@/services/UserService'

interface ReferralPanelProps {
  user: User
  refetchUser: () => void
}

export function ReferralPanel({ user, refetchUser }: ReferralPanelProps) {
  const [requesting, setRequesting] = useState(false)
  const [copied, setCopied] = useState(false)

  const hasReferral = !!user.referralCode
  const referralUrl = user.referralUrl ?? ''

  const handleRequestReferral = async () => {
    try {
      setRequesting(true)
      await requestReferral()
      toast.success('Referral request submitted! An admin will review it shortly.')
      refetchUser()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to submit referral request.')
    } finally {
      setRequesting(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl)
      setCopied(true)
      toast.success('Referral link copied to clipboard!')
      setTimeout(() => setCopied(false), 2500)
    } catch {
      toast.error('Failed to copy link.')
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Maxi Lotto',
          text: `Use my referral link to sign up on Maxi Lotto and start winning!`,
          url: referralUrl,
        })
      } catch {
        // user cancelled share — ignore
      }
    } else {
      handleCopy()
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header card */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 p-6 text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex items-start gap-4">
          <div className="bg-white/20 rounded-xl p-3 backdrop-blur-sm flex-shrink-0">
            <Gift className="size-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Referral Program</h2>
            <p className="text-blue-100 text-sm mt-1 leading-relaxed">
              Earn commissions when players you refer place bets. Invite friends using your personal link.
            </p>
          </div>
        </div>
      </div>

      {hasReferral ? (
        /* ── Approved: show referral link ── */
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 text-green-600 rounded-xl p-2.5">
              <LinkIcon className="size-5" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Your Referral Link</p>
              <p className="text-xs text-gray-500">Share this link — anyone who signs up through it will be linked to you.</p>
            </div>
          </div>

          {/* Referral code badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Code:</span>
            <span className="font-mono text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-lg select-all">
              {user.referralCode}
            </span>
          </div>

          {/* URL copy row */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-200">
            <p className="flex-1 text-sm text-gray-700 font-mono truncate select-all">{referralUrl}</p>
            <button
              onClick={handleCopy}
              className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-500 hover:text-gray-800"
              title="Copy link"
            >
              {copied ? <CheckIcon className="size-4 text-green-500" /> : <CopyIcon className="size-4" />}
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-1">
            <Button
              onClick={handleCopy}
              variant="outline"
              className="flex-1 gap-2 rounded-xl border-gray-200"
            >
              {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
            <Button
              onClick={handleShare}
              className="flex-1 gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
            >
              <Share2 className="size-4" />
              Share
            </Button>
          </div>

          {/* How it works */}
          <div className="border-t border-gray-100 pt-4 mt-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">How it works</p>
            <ol className="space-y-2">
              {[
                'Share your referral link with friends.',
                'They sign up using your link.',
                'When they place bets, you earn a commission on their activity.',
                'Commissions are credited directly to your wallet.',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <span className="flex-shrink-0 size-5 rounded-full bg-blue-100 text-blue-600 font-bold text-xs flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      ) : (
        /* ── Not yet approved: show request button ── */
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-8 text-center space-y-5">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
            <Users className="size-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-gray-900">Become a Referrer</h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
              Apply to join the Maxi Lotto referral program. Once an admin approves your request, you'll receive a unique link to share with friends.
            </p>
          </div>

          <Button
            id="request-referral-btn"
            onClick={handleRequestReferral}
            disabled={requesting}
            className="w-full max-w-xs mx-auto flex gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 h-12 font-semibold"
          >
            {requesting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Gift className="size-4" />
            )}
            {requesting ? 'Submitting...' : 'Request Referral Access'}
          </Button>

          <p className="text-xs text-gray-400">
            Requests are typically reviewed within 24–48 hours.
          </p>

          {/* How it works (compact) */}
          <div className="border-t border-gray-100 pt-5 text-left">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">How it works</p>
            <ol className="space-y-2">
              {[
                'Submit a referral request below.',
                'Admin approves your application.',
                'You receive a unique referral link.',
                'Earn commissions when your referrals play.',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <span className="flex-shrink-0 size-5 rounded-full bg-blue-100 text-blue-600 font-bold text-xs flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'
import {
  fetchMessages,
  sendMessage,
  deleteMessage,
} from '@/lib/db/messages'

// export async function GET(req: NextRequest,context: { params: { conversationId: string } }) {
//   const session = await getServerSession(authOptions)
//   if (!session?.user.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

//   const { conversationId } = await context.params
//   const { before } = await req.json()
//   console.log('cid-->',conversationId)
//   const messages = await fetchMessages(conversationId, before)
//   return NextResponse.json(messages)
// }

export async function GET(req: NextRequest,context:any) {
  const { conversationId } = await context.params;
  const before = req.nextUrl.searchParams.get('before');

  try {
    const messages = await fetchMessages(conversationId, before);
    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function POST(req: NextRequest,context:any) {
  const session = await getServerSession(authOptions)
  if (!session?.user.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { text, attachmentUrl } = await req.json()
  const { conversationId } = await context.params;
  if (!text && !attachmentUrl) {
    return NextResponse.json({ error: 'Message empty' }, { status: 400 })
  }

  const msg = await sendMessage(conversationId, session.user.id, text, attachmentUrl)
  return NextResponse.json(msg)
}

export async function DELETE(req: NextRequest,context:any) {
  const session = await getServerSession(authOptions)
  if (!session?.user.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { messageId } = await req.json()
  const deleted = await deleteMessage(messageId, session.user.id)
  return NextResponse.json(deleted)
}

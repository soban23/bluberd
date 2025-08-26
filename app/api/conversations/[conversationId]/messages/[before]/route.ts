import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'
import {
    fetchMessages,
} from '@/lib/db/messages'


export async function GET(req: NextRequest, context:any) {
    const session = await getServerSession(authOptions)
    if (!session?.user.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { conversationId, before } = context.params
    let messages;
    if (!before) {
        messages = await fetchMessages(conversationId)
    } else {
        messages = await fetchMessages(conversationId, before)
    }


    return NextResponse.json(messages)
}




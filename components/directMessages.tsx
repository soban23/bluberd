'use client'

import { useState, useEffect, FormEvent } from 'react'

import { signIn, signOut, useSession } from 'next-auth/react'
import { Paperclip, X } from "lucide-react"
import { Loader2Icon } from "lucide-react"
import { useRef } from 'react'



import { supabase } from '@/lib/supabaseClient'
import {
    ChatBubble,
    ChatBubbleAvatar,
    ChatBubbleMessage,
    ChatBubbleTimestamp,
    chatBubbleVariant,
    chatBubbleMessageVariants,
    ChatBubbleAction,
    ChatBubbleActionWrapper,
} from '@/src/components/ui/chat/chat-bubble'
import { ChatMessageList } from '@/src/components/ui/chat/chat-message-list'

import Spinner from '@/src/components/ui/chat/spinner'

import { ChatInput } from '@/src/components/ui/chat/chat-input'
import { Button } from '@/components/ui/button'
type Message = {
    id: string
    message_id: string,
    conversation_id: string,
    sender_id: string,
    content: string,
    attachment: string,
    created_at: string,
    sender_name: string,
    sender_pfp: string

}
type User = {
    id: string
    name: string
    username: string
    pfp: string
    numberoffollowers: number
    numberoffollowing: number

}

interface Props {
    //   numberOfLikes: number
    //   numberOfMessages: number
    conversationId: string;
}

export default function Messages({ conversationId }: Props) {
    //   const [name, setName] = useState('')
    //   const [email, setEmail] = useState('')

    const { data: session, status } = useSession()


    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [modalImage, setModalImage] = useState<string | null>(null);
    

    const [messages, setMessages] = useState<Message[]>([])

    const [messageContent, setMessageContent] = useState<string>()
    const [attachmentUrl, setAttachmentUrl] = useState<string>()
    const [previewUrl, setPreviewUrl] = useState<string>()
    const [imgFile, setImgFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(true)
    const [newMessage, setNewMessage] = useState<Message | null>(null)

    const [before, setBefore] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(true);
    const [msgLoading, setMsgLoading] = useState(false)

    const [scrollLoading, setScrollLoading] = useState(false)
    const limit=100;
    //useeffect loading..default next
    // const handleScroll = () => {
    //     console.log('1')
    //     const container = scrollRef.current;
    //     console.log('con', container)
    //     if (!container) return;
    //     console.log('2')
    //     if (container.scrollTop < 100 && hasMore) {
    //         console.log('3')
    //         fetchMessages(); // near top
    //     }
    // };
    const loadMessages = async() => {

        console.log('2')
        if (hasMore) {
            console.log('3')
            setScrollLoading(true)
            await fetchMessages(); // near top

            setScrollLoading(false)
        }
    };
    useEffect(() => {
  // Disable body scroll when the message list is active (scrollable)
  document.body.style.overflow = 'hidden'; // Prevent scrolling

  return () => {
    document.body.style.overflow = 'auto'; // Restore body scroll after the component unmounts or the messages are loaded
  };
}, []);
    useEffect(() => {
        
        if (status === 'loading') return;
        // console.log('userid->',userId)
        if (status === 'authenticated') {
            fetchMessages()
        }
        

    }, [status])
    
    useEffect(() => {
        if (status === 'authenticated' && conversationId && session?.user?.id) {
            const changes = supabase
                .channel('messages')
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'messages',
                        filter: `conversation_id=eq.${conversationId}`,

                    },
                    async (payload) => {
                        console.log(payload)
                        let message = payload.new as Message;
                        message.message_id = payload.new.id;

                        console.log('message-->', message)

                        if (!message?.sender_id || message.sender_id == session?.user.id) {
                            console.log('Missing sender_id in real-time payload or your message');
                            return;
                        }

                        try {
                            const user = await fetchUserData(message.sender_id) as User;
                            console.log('userrr-->', user)
                            const enrichedMessage = {
                                ...message,
                                sender_name: user.name,
                                sender_pfp: user.pfp,
                            } as Message;
                            console.log('enrichedmessage-->', enrichedMessage)

                            setMessages((prev) => [...prev, enrichedMessage]);

                        } catch (err) {
                            console.error('Failed to fetch user data:', err);
                        }
                    }
                    // const message: Message = {
                    //     message_id: "",
                    //     conversation_id: string,
                    //     sender_id: string,
                    //     content: string,
                    //     attachment: string,
                    //     created_at: string,
                    //     sender_name: string,
                    //     sender_pfp: string
                    // };


                )
                .subscribe()
            return () => {
                supabase.removeChannel(changes);
            };


        }


    }, [conversationId, status, session?.user?.id])

    // useEffect(() => {
    //         const changes = supabase
    //             .channel('messages')
    //             .on(
    //                 'postgres_changes',
    //                 {
    //                     event: 'INSERT',
    //                     schema: 'public',
    //                     table: 'messages',
    //                     filter: `conversation_id=eq.${conversationId}`,

    //                 },

    //                 async (payload) => {
    //                     console.log('single msg',payload)




    //                 }


    //             )
    //             .subscribe()
    //         return () => {
    //             supabase.removeChannel(changes);
    //         };





    // }, [conversationId])
    // useEffect(() => {
    //     if (newMessage) {
    //         fetchUserData()

    //     }

    // }, [newMessage])
    const fetchUserData = async (userId: string) => {
        //setLoading(true); // 🟡 Start loading
        try {
            const res = await fetch(`/api/users/${userId}`);
            const data = await res.json();

            console.log(data);
            return data;
        } catch (error) {
            console.error('Failed to fetch error', error);
            return null;
        } finally {
            //setLoading(false); // 🟢 Done loading
            console.log(Messages);

        }

    }

    const fetchMessages = async () => {
        if (!hasMore) {
            return;
        }
        if(!before){
            
            setLoading(true); // 🟡 Start loading
        }


        try {
            const params = new URLSearchParams();
            if (before) params.set('before', before);

            const url = `/api/conversations/${conversationId}/messages${params.size ? `?${params.toString()}` : ''}`;
            const res = await fetch(url);

            if (!res.ok) throw new Error('Failed to fetch messages');


            // const res = await fetch(`/api/conversations/${conversationId}/messages`, {
            //     method: 'GET',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ before: before }),
            // })
            const data = await res.json();
            data.reverse()
            // setMessages(data);
            if (before) {
                const container = scrollRef.current;
                console.log('con', container)
                if (!container) return;

                const prevScrollHeight = container.scrollHeight;

                setMessages(prev => [...data, ...prev]);

                // Wait until the DOM has updated
                setTimeout(() => {
                    const newScrollHeight = container.scrollHeight;
                    const scrollDifference = newScrollHeight - prevScrollHeight;
                    container.scrollTop += scrollDifference;
                }, 0);
            } else {
                setMessages(data);
            }

            console.log('mesages__>', data);
            if (data.length < limit) {
                setHasMore(false)
            }

            //chng this for dat not msgs..plus scroll dont refetch?
            setBefore(data[0]?.created_at);
        } catch (error) {
            console.error('Failed to fetch Messages', error);
        } finally {
        
            setLoading(false); // 🟡 Start loading
            console.log('meages..', messages);

        }

    }
    const uploadToSupabase = async () => {
        if (!imgFile || !session?.user?.id) return;

        const formData = new FormData();
        formData.append('file', imgFile);
        formData.append('userId', session.user.id);
        formData.append('folder', 'dm-images');


        const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });


        const data = await res.json();

        console.log('data for url:', data);
        if (res.ok) {
            console.log('Uploaded:', data.url);

            setAttachmentUrl(data.url)
            return data.url;
        } else {

            console.error('Upload failed:', data.error);
            throw new Error;
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setMsgLoading(true)

        const file = e.target.files?.[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
            setImgFile(file);
        }


        setMsgLoading(false)//add send load..so not whole pg goesbuffering
    };

    // MessageshandleSubmit = async (e: FormEvent) => {
    //     e.preventDefault()
    //     setLoading(true)

    //     const res = await fetch('/api/students', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ name, email }),
    //     })

    //     if (res.ok) {
    //       setName('')
    //       setEmail('')
    //     //   fetchStudents()
    //     }

    //     setLoading(false)
    //   }

    const handleMessageSubmit = async (e: FormEvent) => {
        e.preventDefault()


        //setLoading(true)
        //const content = messageContent;
        console.log(messageContent)

        try {
            if (!imgFile && !messageContent) {
                return;
            }
            setMsgLoading(true)
            let uploadedUrl = null;
            if (imgFile) {
                uploadedUrl = await uploadToSupabase();
            } else {
                console.log('no imgfile')
            }

            console.log('uploaded url-->;', uploadedUrl)
            const res = await fetch(`/api/conversations/${conversationId}/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: messageContent, attachmentUrl: uploadedUrl }),
            })


            const data = await res.json() as Message;
            if (previewUrl) {
                data.attachment = previewUrl;
            }

            console.log('newcontent dataa', data)


            if (res.ok) {
                setMessages((prev) => [...prev, data]);
                setMessageContent('')
                setPreviewUrl('')
                setImgFile(null)
                // setShowmessageBox('');
                // fetchPostsOfFollowings();

            }

        } catch (error) {
            console.log('error:', error);
        }


        setMsgLoading(false)
        //setLoading(false)
    }

    // const topSentinel = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //     const observer = new IntersectionObserver(entries => {
    //         if (entries[0].isIntersecting && hasMore) {
    //             console.log('📦 At top!');
    //             fetchMessages();
    //         }
    //     });
    //     if (topSentinel.current) observer.observe(topSentinel.current);
    //     return () => observer.disconnect();
    // }, [hasMore]);


    return (
  <div>
    {loading ? (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
        <Spinner />
      </div>
    ) : (
      <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="h-full overflow-y-auto pb-20 px-2">
            <ChatMessageList>
              {scrollLoading ? (
                <div className="bg-zinc-300 dark:bg-zinc-700 h-6 w-full flex items-center justify-center">
                  <Spinner />
                </div>
              ) : (
                <>
                  {hasMore && (
                    <div
                      onClick={loadMessages}
                      className="bg-zinc-300 dark:bg-zinc-700 text-center text-sm text-gray-700 dark:text-gray-300 cursor-pointer py-1"
                    >
                      Load More Messages..
                    </div>
                  )}
                </>
              )}

              {messages.map((message) => (
                <div key={message.message_id}>
                  <ChatBubble variant={message.sender_id === session?.user.id ? "sent" : "received"}>
                    {message.sender_id !== session?.user.id && (
                      <ChatBubbleAvatar className="w-8 h-8" src={message.sender_pfp} fallback="US" />
                    )}

                    <ChatBubbleMessage
                      className="p-2 text-sm"
                      variant={message.sender_id === session?.user.id ? "sent" : "received"}
                    >
                      {message.attachment && (
  <div
    className="relative w-full max-w-[500px] h-[300px] rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md cursor-pointer mx-auto"
    onClick={() => setModalImage(message.attachment)}
  >
    <img
      src={message.attachment}
      alt="preview"
      className="w-full h-full object-cover hover:opacity-90 transition-opacity duration-200"
    />
  </div>
)}

                      {message.content && (
                        <div>
                          <p>{message.content}</p>
                        </div>
                      )}
                    </ChatBubbleMessage>
                  </ChatBubble>
                </div>
              ))}
            </ChatMessageList>
          </div>
        </div>

        {/* Input Area */}
        <div className="sticky bottom-0 z-10 bg-white dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700">
          <form
            onSubmit={(e) => handleMessageSubmit(e)}
            className="relative rounded-lg border dark:border-gray-700 bg-background dark:bg-gray-800 focus-within:ring-1 focus-within:ring-ring p-1"
          >
            {previewUrl && (
              <div className="relative inline-block w-24 h-24 m-2">
                <img
                  src={previewUrl}
                  alt="preview"
                  className="w-32 h-32 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl('');
                    setImgFile(null);
                  }}
                  className="absolute top-0 right-0 bg-black bg-opacity-50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-opacity-75"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <ChatInput
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Type your message here..."
              className="min-h-12 resize-none rounded-lg bg-background dark:bg-gray-800 text-black dark:text-white border-0 p-3 shadow-none focus-visible:ring-0"
            />
            <div className="flex items-center p-3 pt-0">
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="size-4" />
                <span className="sr-only">Attach file</span>
              </Button>

              <Button
                type="submit"
                disabled={msgLoading}
                size="sm"
                className="ml-auto gap-1.5"
              >
                Send Message
              </Button>
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </form>
        </div>

        {/* Image Modal */}
        {modalImage && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/80 flex items-center justify-center z-50">
            <div className="relative max-w-full max-h-full">
              <button
                className="absolute top-2 right-2 z-10 bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/90"
                onClick={() => setModalImage(null)}
              >
                <X className="w-4 h-4" />
              </button>
              <img
                src={modalImage}
                alt="Full view"
                className="max-h-[90vh] max-w-[90vw] object-contain rounded"
              />
            </div>
          </div>
        )}
      </div>
    )}
  </div>
);

}




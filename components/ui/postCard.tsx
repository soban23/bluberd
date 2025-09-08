"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Heart, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
type Props = {
  name: string;
  username: string;
  avatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isOwnPost?: boolean;
  onLike: () => void;
  onLikesClick?: () => void;
  onComment?: () => void;
  onCommentsClick?: () => void;
  onClick?: () => void;
  onDelete?: () => void;

  onProfileClick?: () => void;
};

export default function PostCard({
  name,
  username,
  avatar,
  content,
  image,
  likes,
  comments,
  isLiked,
  isOwnPost = false,
  onLike,
  onLikesClick,
  onComment,
  onCommentsClick,
  onClick,
  onDelete,
  onProfileClick,
}: Props) {
  return (
    <Card className="w-full max-w-xl mx-auto mb-4 shadow-sm border border-muted dark:border-gray-700 bg-white dark:bg-gray-900">
      <CardHeader className="flex flex-row items-center gap-4 pb-0">
        <Avatar
          className="hover:cursor-pointer"
          onClick={() => onProfileClick?.()}
        >
          <AvatarImage src={avatar} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div
            onClick={onProfileClick}
            className="hover:underline cursor-pointer font-medium text-black dark:text-white"
          >
            {name}
          </div>
          <div
            onClick={() => onProfileClick?.()}
            className=" hover:underline cursor-pointer text-sm text-muted-foreground dark:text-gray-400"
          >
            @{username}
          </div>
        </div>
        {isOwnPost && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-destructive dark:text-red-500"
          >
            <Trash2 size={16} />
          </button>
        )}
      </CardHeader>
      <CardContent className="space-y-3 text-black dark:text-white">
        <div onClick={onClick} className="cursor-pointer hover:none">
          <p>{content}</p>
        </div>
        {image && (
          <div
            onClick={onClick}
            className="relative rounded-md overflow-hidden border cursor-pointer border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 max-w-full sm:max-w-[350px] md:max-w-[400px] lg:max-w-[500px] mx-auto"
          >
            <img
              src={image}
              alt="post image"
              width={600}
              height={400}
              className="w-full h-[300px] object-cover"
            />
          </div>
        )}

        <div className="flex gap-6 pt-2 text-muted-foreground dark:text-gray-400 text-sm">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLike();
            }}
            className="flex items-center gap-1 hover:text-primary dark:hover:text-blue-400"
          >
            <Heart
              size={16}
              className={isLiked ? "fill-red-500 text-red-500" : ""}
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLikesClick?.();
            }}
            className="hover:underline"
          >
            {likes} likes
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onComment?.();
            }}
            className="flex items-center gap-1 hover:text-primary dark:hover:text-blue-400"
          >
            <MessageCircle size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCommentsClick?.();
            }}
            className="hover:underline"
          >
            {comments} comments
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

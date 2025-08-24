
const PostImage = ({ imageUrl }: { imageUrl: string }) => {
  return (
    <div className="w-full max-w-[100%] h-auto max-h-[400px] sm:max-h-[300px] flex justify-center items-center overflow-hidden rounded-lg bg-gray-200">
      <img
        src={imageUrl}
        alt="Post Image"
        className="object-cover w-full h-full rounded-lg shadow-md"
      />
    </div>
  );
};

export default PostImage;

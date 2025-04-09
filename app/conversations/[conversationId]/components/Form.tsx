"use client";
import useConversation from "@/app/hooks/useConversation";
import axios from "axios";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { HiPaperAirplane, HiPhoto } from "react-icons/hi2";
import MessageInput from "./MessageInput";

interface CloudinaryResponse {
  secure_url: string;
  // Add other fields you expect from Cloudinary
}
const Form = () => {
  const { conversationId } = useConversation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    // Handle form submission
    setValue("message", "", { shouldValidate: true }); // To re-render the component
    axios.post("/api/messages", {
      ...data,
      conversationId,
    });
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Set up Cloudinary upload parameters
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "Messenger_App"); // Cloudinary preset name

      // Send the file to Cloudinary
      const cloudinaryResponse = await axios.post<CloudinaryResponse>(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      // Extract secure URL
      const imageUrl = cloudinaryResponse.data.secure_url;

      // Send the image URL to your messages API
      if (imageUrl) {
        const response = await axios.post("/api/messages", {
          image: imageUrl,
          conversationId,
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
      <label htmlFor="fileInput">
        <HiPhoto size={30} className=" text-sky-500 cursor-pointer" />
      </label>
      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        onChange={handleUpload}
        accept="image/*"
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder="Write a message"
        />
        <button
          className="rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition"
          type="submit"
        >
          <HiPaperAirplane size={18} className="text-white" />
        </button>
      </form>
    </div>
  );
};

export default Form;

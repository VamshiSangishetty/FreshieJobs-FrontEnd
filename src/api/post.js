import client from "./client"

export const getPosts =async(pageNo,limit)=>{
try {
    const {data}=await client(`/post/posts?pageNo=${pageNo}&limit=${limit}`)
    return data
} catch (error) {
    const {response}=error
    if(response?.data){
        return response.data; 
    }
    return {error:error.message || error}
}
}

export const deletePost =async(postId)=>{
try {
    const {data}=await client.delete(`/post/${postId}`)
    return data
} catch (error) {
    const {response}=error
    if(response?.data){
        return response.data; 
    }
    return {error:error.message || error}
}
}

export const createPost = async (postData) => {
    try {
      const { data } = await client.post("/post/create", postData);
      return data;
    } catch (error) {
      const { response } = error;
      if (response?.data) {
        return response.data;
      }
      return { error: error.message || error };
    }
  };

  export const getPost = async (postId) => {
    try {
      const { data } = await client(`/post/single/${postId}`);
      return data;
    } catch (error) {
      const { response } = error;
      if (response?.data) {
        return response.data;
      }
      return { error: error.message || error };
    }
  };

  export const updatePost = async (postId, postInfo) => {
    try {
      const { data } = await client.put(`/post/${postId}`, postInfo);
      return data;
    } catch (error) {
      const { response } = error;
      if (response?.data) {
        return response.data;
      }
      return { error: error.message || error };
    }
  };
  
  
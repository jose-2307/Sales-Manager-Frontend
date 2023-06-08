const ENDPOINT = "https://api.cloudinary.com/v1_1/dmevmh3ch/image/upload";

export const submitImage = async (image) => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset","Sales_Manager");
    data.append("cloud_name","dmevmh3ch");

    const response = await fetch(ENDPOINT, {
        method: "post",
        body: data
    });

    if (response.ok) {
        return response.json();
    } else {
        throw new Error("Error subiendo la imágen.")
    }
}
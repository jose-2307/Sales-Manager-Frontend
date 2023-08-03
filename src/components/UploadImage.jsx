import { useState } from "react";
import { submitImage } from "../services/images.service";


const UploadImage = () => {
    const [image, setImage] = useState({});

    const submit = async () => {
        const img = await submitImage(image);
        // console.log(img)
        setImage({ url: img.url, name: img.original_filename });
    }
    console.log(image);
    return (
        <div>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
            <button onClick={submit}>upload</button> 
            {image.toString().startsWith("http") && <img src={image} />}

        </div>
    )
}

export default UploadImage;
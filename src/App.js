import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.REACT_APP_GOOGLE_GENERATIVE_AI_API_KEY;

function App() {
    const [aiResponse, setAiResponse] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        const runGenerativeAI = async () => {
            try {
                if (!selectedFile) return;

                const genAI = new GoogleGenerativeAI("AIzaSyCkzBtsFcn3PBIrC0xUtggBwVTDIMC23uo");
                const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

                const prompt = "please give detail info of the following image?";
                const imagePart = await fileToGenerativePart(selectedFile);

                const result = await model.generateContent([prompt, imagePart]);
                const response = await result.response;
                const text = await response.text();
                setAiResponse(text);
            } catch (error) {
                console.error('Error running Generative AI:', error);
                setAiResponse('Error running Generative AI');
            }
        };

        runGenerativeAI();
    }, [selectedFile]);

    // Function to convert uploaded file to GoogleGenerativeAI.Part object.
    const fileToGenerativePart = async (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        return new Promise((resolve) => {
            reader.onloadend = () => {
                const base64EncodedData = reader.result.split(',')[1];
                const mimeType = file.type;
                resolve({ inlineData: { data: base64EncodedData, mimeType } });
            };
        });
    };

    // Handler function for file upload change
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    return (
        <div>
            <h1>Generative AI Image App!</h1>
            <p>Built with ❤️ using ReactJS + Redux + Google Generative AI</p>

            <input type="file" onChange={handleFileChange} />

            {selectedFile && (
                <div>
                    <h2>Selected Image Preview:</h2>
                    <img src={URL.createObjectURL(selectedFile)} alt="Selected Image" style={{ maxWidth: '200px', marginTop: '10px' }} />
                </div>
            )}

            <h2>AI Response:</h2>
            <p>{aiResponse}</p>
        </div>
    );
}

export default App;

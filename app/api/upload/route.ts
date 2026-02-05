import AWS from "aws-sdk"; // Import AWS SDK

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { fileName, fileType } = body; // Dynamically receives image name and type

        // Configure AWS SDK
        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: "ap-south-1",
        });

        const bucketName = "scasys"; 

        // Define upload parameters
        const params = {
            Bucket: bucketName,
            Key: fileName, // Name of the file to be saved in the bucket
            ContentType: fileType, // Dynamically set MIME type
        };

        // Generate a signed URL for uploading
        const uploadUrl = await s3.getSignedUrlPromise("putObject", params);

        return new Response(
            JSON.stringify({ uploadUrl }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error processing POST request:", error);
        return new Response(
            JSON.stringify({ error: "Failed to process request" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        const { fileName } = body; // File name to be deleted from S3

        if (!fileName) {
            return new Response(
                JSON.stringify({ error: "Missing fileName in the request body" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Configure AWS SDK
        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            region: "ap-south-1",
        });

        const bucketName = "scasys"; 

        // Define S3 delete parameters
        const params = {
            Bucket: bucketName,
            Key: fileName, // Name of the file to be deleted
        };

        // Delete the object
        await s3.deleteObject(params).promise();

        return new Response(
            JSON.stringify({ message: "File deleted successfully" }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (error) {
        console.error("Error deleting object from S3:", error);
        return new Response(
            JSON.stringify({ error: "Failed to delete object" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

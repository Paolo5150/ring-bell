import { BlobServiceClient } from '@azure/storage-blob';
import {
    Body,
    Controller,
    OnModuleInit,
    Post,
    Req
} from '@nestjs/common';


import * as fs from 'fs';
import * as path from 'path';
import { FilesService } from './FilesService';

@Controller('files')
export class FilesController implements OnModuleInit {

    private blobServiceClient: BlobServiceClient | undefined;

    constructor(private readonly filesService: FilesService) {
        console.log("FileController constructor")
    }

    @Post("test")
    async test(@Req() req) {
        const chunks: Buffer[] = [];

        for await (const chunk of req) {
            chunks.push(chunk);
        }

        const image = Buffer.concat(chunks);


        const fileName = `img_${Date.now()}.jpg`;

        fs.mkdirSync(path.dirname(fileName), { recursive: true });
        fs.writeFileSync(fileName, image);

        console.log("Image size:", image.length);

        return { ok: true };
    }

    @Post('upload')
    async upload(@Body() body: any): Promise<any> {
        console.log("upload requested ", body)

        return new Promise(resolve => {

            setTimeout(() => {

                resolve({
                    success: true,
                    received: "async reply",
                });

            }, 5000);
        });

    }

    async onModuleInit() {
        // try {
        //     this.blobServiceClient =
        //         BlobServiceClient.fromConnectionString(
        //             process.env.AZURE_STORAGE_CONNECTION_STRING!,
        //         );
        // } catch (err) {
        //     console.log("ERROR connecting to blob: ", err)
        // }

        // console.log("Connected!")

        // const containerClient = this.blobServiceClient!.getContainerClient('files');
        // try {
        //     await containerClient.createIfNotExists();
        // } catch (err) {
        //     console.log("ERROR while creating folder ", err)
        // }

        // //Test upload
        // try {
        //     const fileName = 'test.txt'
        //     var blobfile = await containerClient.getBlockBlobClient(fileName);

        //     const fileSize = fs.statSync(fileName).size;
        //     const stream = fs.createReadStream(fileName);

        //     let uploaded = 0;
        //     console.log('File Size ', fileSize)

        //     stream.on('data', async (chunk) => {
        //         uploaded += chunk.length;
        //         //console.log('chunk ', chunk.length)
        //         const percent = ((uploaded / fileSize) * 100).toFixed(2);
        //         //console.log(`Uploading: ${percent}%`);
        //     });

        //     // await blobfile.uploadStream(stream, undefined, undefined, {
        //     //     onProgress: (ev) =>{
        //     //         console.log("Upload progress ", ev.loadedBytes)
        //     //     }
        //     // })

        // } catch (err) {
        //     console.log("Failed to upload " + err)
        // }

    }



}
import { Injectable } from '@nestjs/common';
import { BlobServiceClient } from '@azure/storage-blob';

@Injectable()
export class FilesService {
    private readonly containerName = 'uploads';

    private blobServiceClient: BlobServiceClient;

    constructor() {
        this.blobServiceClient =
            BlobServiceClient.fromConnectionString(
                process.env.AZURE_STORAGE_CONNECTION_STRING!,
            );
    }

    async uploadFile(fileName: string, buffer: Buffer) {
        const containerClient =
            this.blobServiceClient.getContainerClient(
                this.containerName,
            );

        await containerClient.createIfNotExists();

        const blockBlobClient =
            containerClient.getBlockBlobClient(fileName);

        await blockBlobClient.uploadData(buffer);

        return blockBlobClient.url;
    }

    async downloadFile(fileName: string) {
        const containerClient =
            this.blobServiceClient.getContainerClient(
                this.containerName,
            );

        const blobClient =
            containerClient.getBlobClient(fileName);

        const response = await blobClient.download();

        return response.readableStreamBody;
    }
}
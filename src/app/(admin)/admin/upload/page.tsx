import { TestUploadForm } from "@/components/admin/TestUploadForm";

export default function UploadTestPage() {
    return (
        <div className="space-y-8">
             <div>
                <h1 className="text-3xl font-headline font-bold">Create a New Test</h1>
                <p className="text-muted-foreground">Fill in the details and upload question JSON files to create a new mock test.</p>
            </div>
            <TestUploadForm />
        </div>
    );
}

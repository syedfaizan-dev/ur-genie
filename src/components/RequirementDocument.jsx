import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";

export default function RequirementDocument({ document }) {
    const handleDownloadDocument = () => {
        if (!document || typeof document === "string") {
          alert("The document is not properly formatted for download.");
          return;
        }
      
        const doc = new Document({
          sections: [
            {
              properties: {},
              children: [
                // Add the title
                new Paragraph({
                  children: [
                    new TextRun({
                      text: document.title,
                      bold: true,
                      size: 28,
                    }),
                  ],
                }),
                // Add sections and stories
                ...document.sections.map((section) => {
                  const sectionTitle = new Paragraph({
                    text: section.sectionTitle,
                    heading: "Heading2",
                  });
      
                  const stories = section.stories.map(
                    (story) =>
                      new Paragraph({
                        text: `${story}`,
                        bullet: {
                          level: 0,
                        },
                      })
                  );
      
                  return [sectionTitle, ...stories];
                }).flat(),
              ],
            },
          ],
        });
      
        Packer.toBlob(doc).then((blob) => {
          saveAs(blob, "requirements.docx");
        });
      };
    return (
        <>
            {document === "" ? (
            <div className="max-h-96">Please select at least one feature.</div>
            ) : (
            <>
                {typeof document === "string" ? (
                    <div className="overflow-y-scroll max-h-96">{document}</div>
                ) : (
                    <div className="overflow-y-scroll max-h-96">
                        <h3 className="font-bold">{document.title}</h3>
                        <h5 className="font-bold">{document.projectTitle}</h5>
                        {document.sections.map((section, idx) => (
                            <div key={idx}>
                                <h4 className="text-lg font-semibold">{section.sectionTitle}</h4>
                                <ul className="list-disc pl-5">
                                    {section.stories.map((story, index) => (
                                        <li key={index}>{story}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
                <button
                    onClick={handleDownloadDocument}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
                >
                    Download as Word Document
                </button>
            </>
            )}
        </>
    );
}
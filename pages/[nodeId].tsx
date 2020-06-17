import Layout from "../components/layout";

async function getStaticPaths() {
  const { getPages } = require("../figma/api.ts");
  const [pages] = await getPages();
  const paths = pages
    .reduce((acc, page) => {
      return [...acc, ...page.children];
    }, [])
    .map((frame) => ({ params: { nodeId: frame.id } }));
  return { paths, fallback: false };
}

async function getStaticProps({ params }) {
  const { getPages, getImage } = require("../figma/api.ts");
  const [pages, fileName] = await getPages();
  const image = await getImage(params.nodeId);
  return {
    props: {
      pages,
      image,
      nodeId: params.nodeId,
      fileId: process.env.FIGMA_FILE_ID,
      fileName,
    },
  };
}

interface NodeProps {
  pages: any[];
  image: string;
  nodeId: string;
  fileId: string;
  fileName: string;
}
function Node({ pages, image, nodeId, fileId, fileName }: NodeProps) {
  return (
    <Layout pages={pages} nodeId={nodeId} fileId={fileId} fileName={fileName}>
      {image ? (
        <embed
          id="pdf"
          title="Figma PDF"
          type="application/pdf"
          src={image}
          style={{
            display: "block",
            width: "100%",
            minHeight: "calc(100vh - 70px)",
            border: "0",
          }}
        />
      ) : (
        "No Figma node found."
      )}
    </Layout>
  );
}

export { Node as default, getStaticPaths, getStaticProps };
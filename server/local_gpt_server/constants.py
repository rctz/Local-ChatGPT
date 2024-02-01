from chromadb.config import Settings


PERSIST_DIRECTORY="db"
EMBEDDINGS_MODEL_NAME="all-MiniLM-L6-v2"
SOURCE_DIRECTORY="source_documents"
CHROMA_MAX_BATCH_SIZE = 5000

# Define the Chroma settings
CHROMA_SETTINGS = Settings(
        persist_directory=PERSIST_DIRECTORY,
        anonymized_telemetry=False
)

-- Create resume_downloads table to track email submissions for resume downloads

CREATE TABLE IF NOT EXISTS resume_downloads (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_resume_downloads_email ON resume_downloads(email);

-- Create index on downloaded_at for analytics
CREATE INDEX IF NOT EXISTS idx_resume_downloads_downloaded_at ON resume_downloads(downloaded_at);

-- Add comment
COMMENT ON TABLE resume_downloads IS 'Tracks email submissions for resume downloads';

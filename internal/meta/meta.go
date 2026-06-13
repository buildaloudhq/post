package meta

const Name = "post"

// Version, Commit, and Date are the build identifiers — vars (not consts) so
// the release build injects real values via -ldflags "-X .../meta.Version=…".
// Local and source builds report the defaults below.
var (
	Version = "dev"
	Commit  = "none"
	Date    = "unknown"
)

package meta

const Name = "post"

// Version is the build version. It's a var (not a const) so the release
// build can inject the real value via -ldflags "-X .../meta.Version=v1.2.3".
// Local and source builds report "dev".
var Version = "dev"

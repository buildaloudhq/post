package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"

	"github.com/buildaloudhq/post/internal/meta"
)

var rootCmd = &cobra.Command{
	Use:          meta.Name,
	Short:        "Draft and cross-post to social-media platforms",
	Version:      fmt.Sprintf("%s (commit %s, built %s)", meta.Version, meta.Commit, meta.Date),
	SilenceUsage: true,
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		os.Exit(1)
	}
}

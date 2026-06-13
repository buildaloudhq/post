package cmd

import (
	"fmt"

	"github.com/spf13/cobra"

	"github.com/buildaloudhq/post/internal/meta"
)

var statusCmd = &cobra.Command{
	Use:   "status",
	Short: "Show status",
	Args:  cobra.NoArgs,
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Printf("%s %s\n", meta.Name, meta.Version)
	},
}

func init() {
	rootCmd.AddCommand(statusCmd)
}

#!/usr/bin/env bash

# Tested on Bash 3.2

if ! command -v gh &> /dev/null
then
    echo "gh could not be found. Please install it with 'brew install gh'"
    exit
fi

if ! command -v yq &> /dev/null
then
    echo "yq could not be found. Please install it with 'brew install yq'"
    exit
fi

output_file="_data/projects.yaml"
touch "$output_file"

github_repos=()
while IFS='' read -r line; do github_repos+=("$line"); done < <(find _projects -name '*.md' -exec yq --front-matter="extract" '.links[] | select(.url == "*github.com*").url' {} \;)

for url in "${github_repos[@]}"; do
    echo "Fetching star count for $url"

    IFS=" " read -r -a nameAndStar <<< "$(gh repo view "$url" --json nameWithOwner,stargazerCount --template '{{.nameWithOwner}} {{.stargazerCount}}')"
    name=${nameAndStar[0]}
    stars=${nameAndStar[1]}

    yq -i ".github[\"$name\"].stars = $stars" "$output_file"

    echo "Fetching releases for $url"
    IFS=" " read -r -a releases <<< "$(gh release list -R "$name" --json isLatest,tagName,publishedAt --jq 'first(.[] | select(.isLatest == true)) // .[0]' | jq -r '[.isLatest, .tagName, .publishedAt] | @tsv' | xargs)"
    isLatest=${releases[0]}
    tagName=${releases[1]}
    publishedAt=${releases[2]}

    yq -i ".github[\"$name\"].isLatest = $isLatest" "$output_file"
    yq -i ".github[\"$name\"].tag = \"$tagName\"" "$output_file"
    yq -i ".github[\"$name\"].publishedAt = \"$publishedAt\"" "$output_file"
done

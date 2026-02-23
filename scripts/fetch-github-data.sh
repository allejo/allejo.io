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

github_repos=()
while IFS='' read -r line; do github_repos+=("$line"); done < <(find _projects -name '*.md' -exec yq --front-matter="extract" '.links[] | select(.url == "*github.com*").url' {} \;)

for url in "${github_repos[@]}"; do
    echo "Fetching star count for $url"

    IFS=" " read -r -a nameAndStar <<< "$(gh repo view "$url" --json nameWithOwner,stargazerCount --template '{{.nameWithOwner}} {{.stargazerCount}}')"
    name=${nameAndStar[0]}
    stars=${nameAndStar[1]}

    yq -i ".github_stars[\"$name\"] = $stars" _data/github_data.yaml

    echo "Fetching releases for $url"
    IFS=" " read -r -a releases <<< "$(gh release list -R "$name" --json isLatest,tagName,publishedAt --jq '.[] | select(.isLatest == true)' | jq -r '[.tagName, .publishedAt] | @tsv' | xargs)"
    tagName=${releases[0]}
    publishedAt=${releases[1]}

    yq -i ".github_releases[\"$name\"].tag = \"$tagName\"" _data/github_data.yaml
    yq -i ".github_releases[\"$name\"].publishedAt = \"$publishedAt\"" _data/github_data.yaml
done

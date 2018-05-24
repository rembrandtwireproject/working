import yaml
import io
import json

def get_metadata(yamlfile):
  with io.open(yamlfile, "r") as stream:
    for doc in yaml.load_all(stream):
      # This is bogus, but there's no other way I've found to get just the first doc
      break
  return doc

def create_node(node_slug, branch_slug):
  node_yamlfile = f"../_pages/{branch_slug}/" + node_slug + ".html"
  node_data = get_metadata(node_yamlfile)
  # if this is a watermark file, we end here
  if node_data["layout"] == "watermark":
    node = { "name": node_data["name"], "slug": node_slug }
  else:
    children = [ create_node(node_data["if-yes"], branch_slug), create_node(node_data["if-no"], branch_slug) ]
    node = { "name": node_data["question"], "slug": node_slug, "children": children }
  return node

# Do this for each branch
with io.open("../_data/branches.yml", "r") as stream:
  all_branches = yaml.load(stream)

for branch, branch_metadata in all_branches.items():
  print(branch)
  if "image" in branch_metadata and branch != "foolscap_5_pointed_collar":
    branchmap = create_node(branch_metadata["start"], branch)
    with io.open(f"../_pages/{branch}/branchmap.json", "w") as bmstream:
      bmstream.write(json.dumps(branchmap))
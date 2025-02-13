# Sets path to locally-provided cookbooks for all metadata-provided dependencies.
# Add `depends [cookbook]` entries to `metadata.rb` and add the following line to `Berksfile`:
# instance_eval File.read('../local_cookbooks.rb'), __FILE__
metadata = Chef::Cookbook::Metadata.new
metadata.from_file('metadata.rb')
metadata.dependencies.each_key do |cookbook|
  path = "../#{cookbook}"
  next unless File.directory? path
  cookbook cookbook, path: path
end

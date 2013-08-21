trap("SIGINT") { exit! }

task :default do
  exec 'rake -T'
end

def puts_and_exec command
  puts command
  exec command
end

desc 'Build site (production)'
task :build do
  puts_and_exec 'jekyll build --config _config.yml --trace'
end

desc 'Preview and watch changes on local machine (development)'
task :preview do
  puts_and_exec 'jekyll serve --watch --trace'
end

def permalink file
  title = File.basename(file, '.md')
  title.sub!(/^\d+\-\d+\-\d+\-/, '')
  "/products/#{title}.html"
end

desc 'generate series index of products'
task :index do
  require 'yaml'
  index = {}
  products = File.expand_path('../products/', __FILE__)
  Dir.chdir(products)
  products_md = Dir.glob("**/*.md")
  products_md.each do |file|
    content = IO.read(file)
    yaml = YAML::load(content)
    cat = yaml["category"]
    series = yaml["series"]
    index[cat] = [] unless index.has_key?(cat)
    included = false
    index[cat].each do |v|
      included = true and break if v[0] == series
    end
    index[cat] << [series, permalink(File.basename(file))] unless included
  end
  puts "sub_categories:"
  index.each do |k,v|
    puts "  \"#{k}\": #{v}"
  end
end

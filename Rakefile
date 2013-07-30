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

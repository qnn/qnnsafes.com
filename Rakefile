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

namespace :update do
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
    config = File.expand_path('../_config.yml', __FILE__)
    file = IO.read(config)
    start = "# sub_categories::START"
    start = file.index(start) + start.length
    finish = file.index("# sub_categories::END")
    output = "#{file[0, start]}\nsub_categories:\n"
    index.each do |k,v|
      output += "  \"#{k}\": #{v}\n"
    end
    output += "#{file[finish..-1]}"
    File.open(config, 'w') do |file|
      file.write output
    end
    puts "Successfully updated _config.yml."
  end
end

desc 'format the table that copies from spreadsheets'
task :format do
  spreadsheet_file = File.expand_path('../spreadsheets.data', __FILE__)
  spreadsheet = IO.read(spreadsheet_file)
  spreadsheet.gsub!("\t", '</td><td>')
  puts '  <table class="table">'
  spreadsheet.lines.each_with_index do |line, index|
    line.strip!
    if index == 0
      line = line.gsub('td>', 'th>').gsub(/\s+/, ' ')
      puts '    <thead class="table-head">'
      puts "      <tr><th>#{line}</th></tr>"
      puts '    </thead>'
      puts '    <tbody class="table-body">'
    else
      puts "      <tr><td>#{line}</td></tr>"
    end
  end
  puts '    </tbody>'
  puts '  </table>'
end

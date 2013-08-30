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

def process_spreadsheets spreadsheet
  models = []
  output = "  <table class=\"table\">\n"
  spreadsheet.gsub!("\t", '</td><td>')
  spreadsheet.lines.each_with_index do |line, index|
    line.strip!
    if index == 0
      line = line.gsub('td>', 'th>').gsub(/\s+/, ' ')
      output += "    <thead class=\"table-head\">\n"
      output += "      <tr><th>#{line}</th></tr>\n"
      output += "    </thead>\n"
      output += "    <tbody class=\"table-body\">\n"
    else
      line.sub!(/^(.+?)</){ |m| m.gsub(/\s/, '') }
      output += "      <tr><td class=\"nowrap\">#{line}</td></tr>\n"
      models << line[/^(.+?)</,1]
    end
  end
  output += "    </tbody>\n"
  output += "  </table>\n"
  { table: output, models: models }
end

desc 'format the table that copies from spreadsheets'
task :format do
  spreadsheet_file = File.expand_path('../spreadsheets.data', __FILE__)
  spreadsheet = IO.read(spreadsheet_file)
  content = process_spreadsheets(spreadsheet)
  puts content[:table]
end

desc 'format and automatically update'
task :format_and_update do
  spreadsheet_file = File.expand_path('../spreadsheets.data', __FILE__)
  spreadsheet = IO.read(spreadsheet_file)
  content = process_spreadsheets(spreadsheet)
  model_regex = Regexp.union(*content[:models])
  series = []
  Dir.chdir(File.dirname(__FILE__))
  Dir['products/**/*.md'].each do |file|
    File.open(file, 'r') do |f|
      _file = f.read
      if _file =~ model_regex
        series << {
          name: file,
          file: _file
        }
      end
    end
  end
  series.each do |product|
    n = product[:name]
    c = product[:file]
    spec_index = c.index('specs: |')
    if spec_index.nil?
      puts "Warning: cannot find specs in #{n}."
    else
      specs = content[:table]
      content[:models].each do |m|
        if c.include?("name: #{m}")
          specs = specs.sub(/<tr>(.+?)#{m}/, "<tr class=\"highlight\">\\1#{m}")
          break
        end
      end
      c.sub!(/specs:\s\|(.+?)\n\n/m, "specs: |\n#{specs}\n")
      File.open(n, 'w') { |file| file.write c }
      puts "Success: updated specs in #{n}."
    end
  end
end

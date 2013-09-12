require "json"

module LiquidExtend
  def lastchar(input)
    input[-1]
  end
  def json(input)
    input.to_json
  end
  def prepend_relative(input, relative)
    (input[0, 7] == "http://" || input[0, 8] == "https://" ? '' : relative) + input
  end
  def sub_img_cdn(input, cdn)
    input.gsub('{IMAGE_CDN}', cdn)
  end
  def indent(input, num)
    input.strip.gsub("\n\n","\n").gsub(/^/m, (["\t"] * num).join)
  end
  def check_if_blank(input)
    input.length>0?input:"No content."
  end
  
  Liquid::Template.register_filter self
end

module Jekyll
  module Tags
    class IncludeTag < Liquid::Tag
      def render(context)
        file = context[@file] || @file
        includes_dir = File.join(context.registers[:site].source, '_includes')

        if File.symlink?(includes_dir)
          return "Includes directory '#{includes_dir}' cannot be a symlink"
        end

        if file !~ /^[a-zA-Z0-9_\/\.-]+$/ || file =~ /\.\// || file =~ /\/\./
          return "Include file '#{file}' contains invalid characters or sequences"
        end

        Dir.chdir(includes_dir) do
          choices = Dir['**/*'].reject { |x| File.symlink?(x) } 
          if choices.include?(file)
            source = File.read(file)
            partial = Liquid::Template.parse(source)
            context.stack do
              partial.render(context)
            end
          else
            "Included file '#{file}' not found in _includes directory"
          end
        end
      end
    end
  end
end

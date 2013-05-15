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
    input.gsub('{PRODUCT_IMAGES}', cdn)
  end
  def indent(input, num)
    input.strip.gsub("\n\n","\n").gsub(/^/m, (["\t"] * num).join)
  end
  def check_if_blank(input)
    input.length>0?input:"No content."
  end
  
  Liquid::Template.register_filter self
end

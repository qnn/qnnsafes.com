module Jekyll
	class Page
		alias_method :to_liquid_alias, :to_liquid

		def to_liquid
			to_liquid_alias.deep_merge({
				'location' => @dir.match(/\/tags\//) ? nil : (@dir + '/' + self.basename + self.output_ext).gsub(/\/\//, "/")
			})
		end
	end

	class Post
		alias_method :to_liquid_alias, :to_liquid

		# add one parameter
		# https://github.com/mojombo/jekyll/blob/v1.1.2/lib/jekyll/post.rb#L278
		def to_liquid(attrs = ATTRIBUTES_FOR_LIQUID)
			to_liquid_alias.deep_merge({
				'location' =>  @base.sub(site.source, '') + '/' + self.name
			})
		end
	end
end

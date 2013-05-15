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

		def to_liquid
			to_liquid_alias.deep_merge({
				'location' =>  @base.sub(site.source, '') + '/' + self.name
			})
		end
	end
end

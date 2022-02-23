local function img_src(obj)
  obj:traverse_elements(function(el)
    local name = string.lower(obj:get_element_name(el))
    if name == "img" then
      local src = el:get_attribute("src")

      if src then
          -- el:set_attribute("src", "./media/" .. src)
      end
    end
  end)
  
  return obj
end

return img_src

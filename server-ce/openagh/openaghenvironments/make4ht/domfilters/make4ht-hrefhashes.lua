return function(obj)
  -- replace : characters in links and ids with unserscores
  obj:traverse_elements(function(el) 
    local name = string.lower(obj:get_element_name(el))

    if name == "a" then
        local href = el:get_attribute("href")

        if href and href:match("#+") then
            el:set_attribute("href", href:gsub("#+", "#"))
        end
    end
  end)
  return obj
end

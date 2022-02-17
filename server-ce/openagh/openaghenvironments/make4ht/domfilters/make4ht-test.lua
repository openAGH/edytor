local function test(obj)
  print "Hello world"
  obj:traverse_elements(function(el)
    local cls = el:get_attribute("id")
    print(cls)
    print(el)
    el:set_attribute("id", "TEST")
  end)
  
  return obj
end

return test

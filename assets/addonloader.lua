function trydofile(name)
	pcall(dofile, name);
end

trydofile("../addons/utility.lua"); --Possible Excrulon's dependency file.
trydofile("../addons/addonhelper.lua"); --Possible Lunardi's dependency file.

-- http://stackoverflow.com/questions/5303174/how-to-get-list-of-directories-in-lua
local addons = io.popen([[dir "../addons/" /b /ad]]):lines();

for addon in addons do 

	local addonloader = "../addons/" .. addon .. "/" .. addon .. ".lua";
	trydofile(addonloader);

end

local addonLoaderFrame = ui.GetFrame("addonloader");
addonLoaderFrame:ShowWindow(0);
_G["ADDON_LOADER"] = {};
_G["ADDON_LOADER"]["LOADED"] = true;

function MAP_ON_INIT_HOOKED(addon, frame)
	_G["MAP_ON_INIT_OLD"](addon, frame);

	if _G["ADDON_LOADER"]["LOADED"] then
		local addonLoaderFrame = ui.GetFrame("addonloader");
		addonLoaderFrame:ShowWindow(0);
	end
end

SETUP_HOOK(MAP_ON_INIT_HOOKED, "MAP_ON_INIT");
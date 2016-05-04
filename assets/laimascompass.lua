function MOD_REGISTER_HOOK(modName, hookKey, hookFunction)

	if _G[modName][hookKey] == nil then
		_G[modName][hookKey] = _G[hookKey];
		_G[hookKey] = hookFunction;
	else
		_G[hookKey] = hookFunction;
	end
end

function MOD_DUMP_DATALINE(contents)

	local file, error = io.open("../addons/laimascompass/data.txt", "a");

	if error then
		return;
	end

	file:write(contents .. "\n");
	file:flush();
	file:close();
end

_G["LAIMAS_COMPASS"] = {};
_G["LAIMAS_COMPASS"]["PREHEADER"] = GETMYPCNAME() .. "|" .. GETMYFAMILYNAME() .. "|" ..GETMYPCLEVEL();

function MOD_LAIMAS_COMPASS_MON_DEAD_CLIENT(actor)
	_G["LAIMAS_COMPASS"]["MON_DEAD_CLIENT"](actor);

	local obj = actor;
	local monID = obj:GetType();
	if monID ~= 0 then
		local monCls = GetClassByType("Monster", monID);

		local wiki = GetWikiByName(monCls.Journal);
		local killCount = GetWikiIntProp(wiki, "KillCount") + 1;
		local killsRequired = GetClass('Journal_monkill_reward', monCls.Journal).Count1;

		local mapClassName = session.GetMapName();
    	local mapIES = GetClass('Map', mapClassName)

		local modHeader = _G["LAIMAS_COMPASS"]["PREHEADER"];
		
		MOD_DUMP_DATALINE("KILL|" .. modHeader .. "|" .. mapClassName .. "|" .. monID .. "|" .. killCount .. "|" .. killsRequired);
	end
end

function MOD_LAIMAS_COMPASS_MAP_OPEN(frame)
	_G["LAIMAS_COMPASS"]["MAP_OPEN"](frame);
	DUMP_MAP_DATA(frame);
end

function MOD_LAIMAS_COMPASS_REVEAL_MAP_PICTURE(frame, mapName, info, i, forMinimap)
	_G["LAIMAS_COMPASS"]["REVEAL_MAP_PICTURE"](frame, mapName, info, i, forMinimap);
	DUMP_MAP_DATA(frame);
end

function DUMP_MAP_DATA(frame)

	local mapClassName = session.GetMapName();
	local modHeader = _G["LAIMAS_COMPASS"]["PREHEADER"];
	local list = session.GetMapFogList(mapClassName);
	local cnt = list:Count();
	
	local revealed = 0;
	
	for i = 0 , cnt - 1 do
		local info = list:PtrAt(i);

		if info.revealed == 1 then
			revealed = revealed + 1;
		end
	end
	
	frame:Invalidate();
	
	MOD_DUMP_DATALINE("MAP|" .. modHeader .. "|" .. mapClassName .. "|" .. revealed .. "|" .. cnt);
	
end

MOD_REGISTER_HOOK("LAIMAS_COMPASS", "MON_DEAD_CLIENT", MOD_LAIMAS_COMPASS_MON_DEAD_CLIENT);
MOD_REGISTER_HOOK("LAIMAS_COMPASS", "MAP_OPEN", MOD_LAIMAS_COMPASS_MAP_OPEN);
MOD_REGISTER_HOOK("LAIMAS_COMPASS", "REVEAL_MAP_PICTURE", MOD_LAIMAS_COMPASS_REVEAL_MAP_PICTURE);

ui.SysMsg("Laima's Compass loaded!");
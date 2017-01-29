module.exports = {
	checkRole: function (req, res, next) { 
        
        if (typeof(res.locals.currentUser) == "undefined") { 
                res.render("failedrole") 
        } else { 
                if (res.locals.currentUser.username == "kang") { 
                        next(); 
                } else { 
                        res.render("failedrole"); 
                } 
        } 

} 
}
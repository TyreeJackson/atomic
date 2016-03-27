module.exports  =
{
    name:       "usermanagement",
    methods:
    {
        logonUser:  function(username, password){return {firstName: "System", lastName: "Administrator"};},
        logoffUser: function(){return {firstName: "Guest", lastName: "User"};},
        editUser:   function(userId){return {id: userId, firstName: "James", lastName: "Doohy"};},
        saveUser:   function(user){return user;},
        deleteUser: function(userId){return "Delete successful.";}
    }
}
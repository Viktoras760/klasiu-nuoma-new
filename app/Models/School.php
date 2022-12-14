<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class School extends Model
{
    use HasFactory;

    protected $table = 'school';

    protected $primaryKey = 'id_School';

    protected $fillable = [
        'Name',
        'Adress',
        'Pupil_amount',
        'Teacher_amount'
    ];

    public $timestamps=false;

    public function floors()
    {
        return $this->belongsToMany('App\Models\Floor', 'fk_Schoolid_School', 'fk_Floorid_Floor');
    }

    public function users()
    {
        return $this->belongsToMany('App\Models\User', 'id_User', 'fk_Userid_User');
    }
}
